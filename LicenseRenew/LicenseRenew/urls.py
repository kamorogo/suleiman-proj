from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
# from users import views as user_views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('LicenseTrack.urls')),
    # path('register/', user_views.UsersRegisterView.as_view, name ='register'),
    # path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
    # path('logout/', auth_views.LogoutView.as_view(template_name='users/logout.html'), name='logout'),

]


#  path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
# path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  


if settings.DEBUG:

    urlpatterns += static(settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT)


