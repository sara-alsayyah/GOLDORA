from django.contrib import admin
from django.db.models import Sum, F
from django.db.models.functions import TruncDay
from django.template.response import TemplateResponse
from django.urls import path, reverse
from django.core.mail import send_mail
from django.conf import settings
from .models import Order, OrderItem, Coupon
from .models import OrderItem as OrderItemModel

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'payment_method', 'total_price', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('user__email',)
    change_list_template = 'admin/orders/order/change_list.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'analytics/',
                self.admin_site.admin_view(self.analytics_view),  # 👈 uses this method
                name='orders_order_analytics',
            ),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['analytics_url'] = reverse('admin:orders_order_analytics')
        return super().changelist_view(request, extra_context=extra_context)
    
    def analytics_view(self, request):
        completed_orders = Order.objects.filter(status='delivered')

        total_sales = completed_orders.aggregate(
            total=Sum('total_price')
        )['total'] or 0

        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        shipped_orders = Order.objects.filter(status='shipped').count()
        delivered_orders = completed_orders.count()

        top_products = (
            OrderItemModel.objects
            .filter(order__status='delivered')
            .values(name=F('product__name'))
            .annotate(total_sold=Sum('quantity'))
            .order_by('-total_sold')[:5]
        )

        sales_over_time = (
            completed_orders
            .annotate(day=TruncDay('created_at'))
            .values('day')
            .annotate(total=Sum('total_price'))
            .order_by('day')
        )

        context = {
            **self.admin_site.each_context(request),
            'opts': self.model._meta,
            'title': 'Order Analytics',
            'total_sales': float(total_sales),
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'shipped_orders': shipped_orders,
            'delivered_orders': delivered_orders,
            'top_products': list(top_products),
            'sales_over_time': list(sales_over_time),
        }

        return TemplateResponse(request, 'admin/orders/order/analytics.html', context)

    def save_model(self, request, obj, form, change):
        previous_status = None
        if change:
            previous_status = Order.objects.get(pk=obj.pk).status

        super().save_model(request, obj, form, change)

        if change and previous_status and previous_status != obj.status:
            send_mail(
                subject=f"GOLDORA order #{obj.id} status updated",
                message=(
                    f"Hello {obj.user.first_name or obj.user.email},\n\n"
                    f"Your order status is now: {obj.get_status_display()}.\n"
                    f"Payment method: {obj.get_payment_method_display()}.\n"
                    f"Total: {obj.total_price}.\n\n"
                    "Thank you for shopping with GOLDORA."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[obj.user.email],
                fail_silently=True,
            )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    search_fields = ('product__name',)


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percent', 'active')
    list_filter = ('active',)
