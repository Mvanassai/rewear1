from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import os
from werkzeug.utils import secure_filename

# ✅ STATIC FIX
app = Flask(__name__, static_folder="static")
CORS(app)

# ─────────────────────────────────────────────
# ✅ PAGE ROUTES
# ─────────────────────────────────────────────

@app.route('/')
def home():
    return send_from_directory('static', 'Home.html')

@app.route('/home')
def home_test():
    return send_from_directory('static', 'Home.html')

@app.route('/customer')
def customer():
    return send_from_directory('static/customer', 'customer-dashboard.html')

@app.route('/seller')
def seller():
    return send_from_directory('static/seller', 'seller-dashboard.html')

@app.route('/delivery')
def delivery():
    return send_from_directory('static/Delivery Partner', 'delivery-partner-dashboard.html')

@app.route('/manufacturer')
def manufacturer():
    return send_from_directory('static/Manufacturer', 'manufacturer-dashboard.html')

# ✅ STATIC FILE FIX (CSS/JS)
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)


# ─────────────────────────────────────────────
# ✅ MONGODB
# ─────────────────────────────────────────────

MONGO_URI = "mongodb+srv://vanassai:Vanassai%40125@cluster0.drwy34u.mongodb.net/rewear?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client["rewear"]

customers_collection = db["customers"]
sellers_collection = db["sellers"]
delivery_collection = db["delivery_partners"]
manufacturers_collection = db["manufacturers"]
seller_clothes_collection = db["seller_clothes"]
pickups_collection = db["pickups"]
products_collection = db["products"]


# ─────────────────────────────────────────────
# ✅ FILE UPLOAD CONFIG
# ─────────────────────────────────────────────

UPLOAD_FOLDER = 'static/uploads/clothes'
PRODUCT_UPLOAD_FOLDER = 'static/uploads/products'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PRODUCT_UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def missing_fields(data, required):
    return [f for f in required if not data.get(f)]


# ─────────────────────────────────────────────
# ✅ IMAGE SERVING
# ─────────────────────────────────────────────

@app.route('/static/uploads/clothes/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/static/uploads/products/<filename>')
def uploaded_product(filename):
    return send_from_directory(PRODUCT_UPLOAD_FOLDER, filename)


# ─────────────────────────────────────────────
# ✅ SELLER APIs
# ─────────────────────────────────────────────

@app.route('/api/seller/clothes', methods=['GET'])
def get_seller_clothes():
    clothes = list(seller_clothes_collection.find({}, {"_id": 0}))
    return jsonify(clothes)

@app.route('/api/seller/add-cloth', methods=['POST'])
def add_cloth():
    try:
        name = request.form.get('name')
        category = request.form.get('category')
        size = request.form.get('size')
        condition = request.form.get('condition')
        price = request.form.get('price')
        description = request.form.get('description')
        location = request.form.get('location')
        phone = request.form.get('phone')
        seller_email = request.form.get('seller_email')

        if not all([name, category, size, condition, price, description, location, phone]):
            return jsonify({"success": False, "message": "All fields are required"}), 400

        image = request.files.get('image')

        if not image or not allowed_file(image.filename):
            return jsonify({"success": False, "message": "Invalid image file"}), 400

        filename = secure_filename(image.filename)
        image_path = f"{UPLOAD_FOLDER}/{filename}"
        image.save(image_path)

        cloth_data = {
            "name": name,
            "category": category,
            "size": size,
            "condition": condition,
            "price": price,
            "description": description,
            "location": location,
            "phone": phone,
            "image": image_path,
            "status": "Pending",
            "seller_email": seller_email
        }

        seller_clothes_collection.insert_one(cloth_data)

        return jsonify({"success": True, "message": "Cloth added successfully!"})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route('/api/seller/accept-cloth', methods=['POST'])
def accept_cloth():
    data = request.json
    name = data.get("name")

    cloth = seller_clothes_collection.find_one({"name": name})

    if cloth:
        seller_clothes_collection.update_one(
            {"name": name},
            {"$set": {"status": "Accepted"}}
        )

        pickups_collection.insert_one({
            "cloth_name": cloth["name"],
            "category": cloth["category"],
            "price": cloth["price"],
            "location": cloth["location"],
            "phone": cloth.get("phone"),
            "lat": cloth.get("lat"),
            "lon": cloth.get("lon"),
            "status": "Available"
        })

    return jsonify({"success": True})


@app.route('/api/seller/reject-cloth', methods=['POST'])
def reject_cloth():
    data = request.json
    name = data.get("name")

    seller_clothes_collection.update_one(
        {"name": name},
        {"$set": {"status": "Rejected"}}
    )

    return jsonify({"success": True})


@app.route('/api/seller/delete-cloth', methods=['POST'])
def delete_cloth():
    data = request.json
    name = data.get("name")

    seller_clothes_collection.delete_one({"name": name})
    pickups_collection.delete_many({"cloth_name": name})

    return jsonify({"success": True})


@app.route('/api/seller/my-clothes', methods=['GET'])
def my_clothes():
    seller_email = request.args.get("email")

    clothes = list(
        seller_clothes_collection.find(
            {"seller_email": seller_email},
            {"_id": 0}
        )
    )

    return jsonify(clothes)


# ─────────────────────────────────────────────
# ✅ DELIVERY APIs
# ─────────────────────────────────────────────

@app.route('/api/delivery/pickups')
def get_pickups():
    return jsonify(list(pickups_collection.find({}, {"_id": 0})))


@app.route('/api/delivery/accept-pickup', methods=['POST'])
def accept_pickup():
    data = request.json
    cloth_name = data.get("cloth_name")

    pickups_collection.update_one(
        {"cloth_name": cloth_name},
        {"$set": {"status": "Accepted by Delivery"}}
    )

    seller_clothes_collection.update_one(
        {"name": cloth_name},
        {"$set": {"status": "Delivery Partner Accepted"}}
    )

    return jsonify({"success": True})


# ─────────────────────────────────────────────
# ✅ MANUFACTURER PRODUCT APIs
# ─────────────────────────────────────────────

@app.route('/api/manufacturer/add-product', methods=['POST'])
def add_product():
    try:
        title = request.form.get("title")
        price = request.form.get("price")
        description = request.form.get("description")

        image = request.files.get("image")

        if not title or not price:
            return jsonify({"success": False, "message": "Title and price required"}), 400

        if not image or not allowed_file(image.filename):
            return jsonify({"success": False, "message": "Invalid image"}), 400

        filename = secure_filename(image.filename)
        image_path = f"{PRODUCT_UPLOAD_FOLDER}/{filename}"
        image.save(image_path)

        product = {
            "title": title,
            "price": price,
            "description": description,
            "image": image_path
        }

        products_collection.insert_one(product)

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route('/api/products')
def get_products():
    return jsonify(list(products_collection.find({}, {"_id": 0})))


# ─────────────────────────────────────────────
# ✅ AUTH APIs (LOGIN + SIGNUP)
# ─────────────────────────────────────────────

@app.route('/signup/seller', methods=['POST'])
def signup_seller():
    data = request.json
    required = ['name', 'email', 'phone', 'address', 'password']
    missing = missing_fields(data, required)

    if missing:
        return jsonify({'message': f'Missing fields: {", ".join(missing)}'}), 400

    if sellers_collection.find_one({"email": data["email"]}):
        return jsonify({'message': 'Email already exists'}), 409

    sellers_collection.insert_one(data)

    return jsonify({'message': 'Seller signup successful!'}), 201


@app.route('/login/seller', methods=['POST'])
def login_seller():
    data = request.json

    user = sellers_collection.find_one({
        "email": data.get("email"),
        "password": data.get("password")
    })

    if user:
        return jsonify({'message': 'Seller login successful!'}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


# ─────────────────────────────────────────────
# ✅ RUN
# ─────────────────────────────────────────────

if __name__ == "__main__":
    app.run()