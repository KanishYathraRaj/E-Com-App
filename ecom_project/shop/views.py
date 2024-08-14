from rest_framework import viewsets
from .models import ProductCategory, Product, Wishlist, Cart, CartItem, Order, OrderItem, Address, Payment, TrackingDetails
from .serializers import ProductCategorySerializer, ProductSerializer, WishlistSerializer, CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer, AddressSerializer, PaymentSerializer, TrackingDetailsSerializer , UserSerializer
from django.contrib.auth.models import User

from rest_framework import serializers

# Define a viewset for the User model
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    authentication_classes = []
    permission_classes = []


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def destroy(self, request, *args, **kwargs):
        # Handle custom delete logic if needed
        return super().destroy(request, *args, **kwargs)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class TrackingDetailsViewSet(viewsets.ModelViewSet):
    queryset = TrackingDetails.objects.all()
    serializer_class = TrackingDetailsSerializer
