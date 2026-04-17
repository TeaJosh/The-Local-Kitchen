from django.http import JsonResponse
from .models import AuthToken

def token_required(view_func):
    def wrapper(request, *args, **kwargs): #get the Authorization header from the request
        auth_header = request.headers.get('Authorization', '') #if the header is missing or doesn't start with 'Bearer ', return an error response
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Authorization header must start with Bearer'}, status=401)
        token_key = auth_header.split(' ')[1] #split the header to get the token key
        try:
            token = AuthToken.objects.get(key=token_key)
            request.user = token.user
        except AuthToken.DoesNotExist:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)
        return view_func(request, *args, **kwargs) #return the original view function if the token is valid
    return wrapper