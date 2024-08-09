from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet ,ProductCategoryViewSet, ProductViewSet, WishlistViewSet, CartViewSet, CartItemViewSet, OrderViewSet, OrderItemViewSet, AddressViewSet, PaymentViewSet, TrackingDetailsViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'product-categories', ProductCategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'wishlists', WishlistViewSet)
router.register(r'carts', CartViewSet)
router.register(r'cart-items', CartItemViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'tracking-details', TrackingDetailsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
