from fastapi import FastAPI  # type: ignore
from service.products import get_all_products, load_products
app = FastAPI()

@app.get('/')
def root():
    return{'message':'hello'}

@app.get('/p/')
def dynamic_route():
    return get_all_products()
