from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import init_db, get_db_connection

init_db()
app = FastAPI(title="东北·味道 现代电商API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_USER_ID = 1

class CartItem(BaseModel):
    product_id: int
    quantity: int = 1

class UserUpdate(BaseModel):
    name: str
    phone: str
    address: str
    email: str

@app.get("/api/products")
def get_products():
    conn = get_db_connection()
    products = conn.execute("SELECT * FROM products").fetchall()
    conn.close()
    return [dict(p) for p in products]

@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    conn = get_db_connection()
    product = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    conn.close()
    if not product:
        raise HTTPException(status_code=404, detail="商品不存在")
    return dict(product)

@app.get("/api/cart")
def get_cart():
    conn = get_db_connection()
    items = conn.execute('SELECT c.id as cart_id, c.quantity, p.* FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?', (DEFAULT_USER_ID,)).fetchall()
    conn.close()
    return [dict(i) for i in items]

@app.post("/api/cart")
def add_to_cart(item: CartItem):
    conn = get_db_connection()
    existing = conn.execute("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?", (DEFAULT_USER_ID, item.product_id)).fetchone()
    if existing:
        conn.execute("UPDATE cart SET quantity = quantity + ? WHERE id = ?", (item.quantity, existing['id']))
    else:
        conn.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)", (DEFAULT_USER_ID, item.product_id, item.quantity))
    conn.commit()
    conn.close()
    return {"message": "已加入购物车"}

@app.delete("/api/cart/{cart_id}")
def remove_from_cart(cart_id: int):
    conn = get_db_connection()
    conn.execute("DELETE FROM cart WHERE id = ?", (cart_id,))
    conn.commit()
    conn.close()
    return {"message": "已移除"}

@app.post("/api/orders/checkout")
def checkout_cart():
    conn = get_db_connection()
    items = conn.execute('SELECT c.quantity, p.id, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?', (DEFAULT_USER_ID,)).fetchall()
    if not items:
        conn.close()
        raise HTTPException(status_code=400, detail="购物车为空")
    total = sum(item['price'] * item['quantity'] for item in items)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO orders (user_id, total) VALUES (?, ?)", (DEFAULT_USER_ID, total))
    order_id = cursor.lastrowid
    for item in items:
        cursor.execute("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", (order_id, item['id'], item['quantity'], item['price']))
    cursor.execute("DELETE FROM cart WHERE user_id = ?", (DEFAULT_USER_ID,))
    conn.commit()
    conn.close()
    return {"order_id": order_id, "message": "下单成功"}

@app.get("/api/user")
def get_user():
    conn = get_db_connection()
    user = conn.execute("SELECT id, name, phone, address, email FROM users WHERE id = ?", (DEFAULT_USER_ID,)).fetchone()
    conn.close()
    return dict(user)

@app.put("/api/user")
def update_user(user: UserUpdate):
    conn = get_db_connection()
    conn.execute("UPDATE users SET name = ?, phone = ?, address = ?, email = ? WHERE id = ?", (user.name, user.phone, user.address, user.email, DEFAULT_USER_ID))
    conn.commit()
    conn.close()
    return {"message": "信息已更新"}