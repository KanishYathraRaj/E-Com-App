from django.contrib import admin
from .models import ProductCategory, Product, Wishlist, Cart, CartItem, Order, OrderItem, Address, Payment, TrackingDetails

admin.site.register(ProductCategory)
admin.site.register(Product)
admin.site.register(Wishlist)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Address)
admin.site.register(Payment)
admin.site.register(TrackingDetails)
