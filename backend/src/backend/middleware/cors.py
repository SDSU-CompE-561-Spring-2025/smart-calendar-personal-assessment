from fastapi.middleware.cors import CORSMiddleware


def get_cors_config():
    return {
        "middleware_class": CORSMiddleware,
        "options": {
            "allow_origins": ["*"],
            "allow_credentials": True,
            "allow_methods": ["*"],
            "allow_headers": ["*"]
        }
    }
