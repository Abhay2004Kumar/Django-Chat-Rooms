from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ChatRoomListCreateView, MessageListCreateView, UserProfileView
from .views import CustomTokenObtainPairView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('rooms/', ChatRoomListCreateView.as_view(), name='rooms'),
    path('rooms/<int:room_id>/messages/', MessageListCreateView.as_view(), name='room_messages'),
    path('me/', UserProfileView.as_view(), name='user-profile'),
]
