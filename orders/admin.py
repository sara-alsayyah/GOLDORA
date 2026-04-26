from django.contrib import admin
from django.db.models import Sum, F
from django.db.models.functions import TruncDay
from django.template.response import TemplateResponse
from django.urls import path, reverse
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
                self.admin_site.admin_view(self.analytics_view),
                name='orders_order_analytics',
            ),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['analytics_url'] = reverse('admin:orders_order_analytics')
        return super().changelist_view(request, extra_context=extra_context)

    def analytics_view(self, request):
        total_sales = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0
        total_orders = Order.objects.count()

        top_products = (
            OrderItemModel.objects
            .values(name=F('product__name'))
            .annotate(total_sold=Sum('quantity'))
            .order_by('-total_sold')[:5]
        )

        sales_over_time = (
            Order.objects
            .annotate(day=TruncDay('created_at'))
            .values('day')
            .annotate(total=Sum('total_price'))
            .order_by('day')
        )

        context = {
            **self.admin_site.each_context(request),
            'opts': self.model._meta,
            'title': 'Order Analytics',
            'total_sales': total_sales,
            'total_orders': total_orders,
            'top_products': list(top_products),
            'sales_over_time': list(sales_over_time),
        }
        return TemplateResponse(request, 'admin/orders/order/analytics.html', context)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    search_fields = ('product__name',)


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percent', 'active')
    list_filter = ('active',)
