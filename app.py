# app.py
# ReWear Flask backend — MongoDB Atlas version

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────────────────────
# MongoDB Atlas Configuration
# ─────────────────────────────────────────────────────────────

MONGO_URI = "mongodb+srv://vanassai:Vanassai%40125@cluster0.drwy34u.mongodb.net/rewear?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client["rewear"]

customers_collection = db["customers"]
sellers_collection = db["sellers"]
delivery_collection = db["delivery_partners"]
manufacturers_collection = db["manufacturers"]
seller_clothes_collection = db["seller_clothes"]
pickups_collection = db["pickups"]

# ─────────────────────────────────────────────────────────────
# File Upload Configuration
# ─────────────────────────────────────────────────────────────

UPLOAD_FOLDER = 'static/uploads/clothes'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def missing_fields(data, required):
    return [f for f in required if not data.get(f)]


# ─────────────────────────────────────────────────────────────
# SERVE UPLOADED IMAGES
# ─────────────────────────────────────────────────────────────

@app.route('/static/uploads/clothes/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ─────────────────────────────────────────────────────────────
# GET SELLER CLOTHES (MANUFACTURER DASHBOARD)
# ─────────────────────────────────────────────────────────────

@app.route('/api/seller/clothes', methods=['GET'])
def get_seller_clothes():
    clothes = list(seller_clothes_collection.find({}, {"_id": 0}))
    return jsonify(clothes), 200


# ─────────────────────────────────────────────────────────────
# SELLER ADD CLOTH
# ─────────────────────────────────────────────────────────────

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
        seller_email = request.form.get('seller_email')

        if not all([name, category, size, condition, price, description, location]):
            return jsonify({"success": False, "message": "All fields are required"}), 400

        image = request.files.get('image')

        if not image or not allowed_file(image.filename):
            return jsonify({"success": False, "message": "Invalid image file"}), 400

        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)

        cloth_data = {
            "name": name,
            "category": category,
            "size": size,
            "condition": condition,
            "price": price,
            "description": description,
            "location": location,
            "image": image_path,
            "status": "Pending",
            "seller_email": seller_email
        }

        seller_clothes_collection.insert_one(cloth_data)

        return jsonify({"success": True, "message": "Cloth added successfully!"}), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─────────────────────────────────────────────
# ACCEPT CLOTH (MANUFACTURER)
# ─────────────────────────────────────────────

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

        pickup_data = {
            "cloth_name": cloth["name"],
            "category": cloth["category"],
            "price": cloth["price"],
            "location": cloth["location"],
            "status": "Available"
        }

        pickups_collection.insert_one(pickup_data)

    return jsonify({"success": True})


# ─────────────────────────────────────────────
# REJECT CLOTH
# ─────────────────────────────────────────────

@app.route('/api/seller/reject-cloth', methods=['POST'])
def reject_cloth():

    data = request.json
    name = data.get("name")

    seller_clothes_collection.update_one(
        {"name": name},
        {"$set": {"status": "Rejected"}}
    )

    return jsonify({"success": True})


# ─────────────────────────────────────────────
# GET SELLER CLOTHES FOR SELLER DASHBOARD
# ─────────────────────────────────────────────

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
# GET PICKUPS FOR DELIVERY PARTNER
# ─────────────────────────────────────────────

@app.route('/api/delivery/pickups', methods=['GET'])
def get_pickups():

    pickups = list(
        pickups_collection.find({}, {"_id": 0})
    )

    return jsonify(pickups)


# ─────────────────────────────────────────────
# DELIVERY PARTNER ACCEPT PICKUP
# ─────────────────────────────────────────────

@app.route('/api/delivery/accept-pickup', methods=['POST'])
def accept_pickup():

    data = request.json
    cloth_name = data.get("cloth_name")

    # update pickup status
    pickups_collection.update_one(
        {"cloth_name": cloth_name},
        {"$set": {"status": "Accepted"}}
    )

    # update seller cloth status
    seller_clothes_collection.update_one(
        {"name": cloth_name},
        {"$set": {"status": "Delivery Accepted"}}
    )

    return jsonify({"success": True})


# ─────────────────────────────────────────────────────────────
# SIGNUP ENDPOINTS
# ─────────────────────────────────────────────────────────────

@app.route('/signup/customer', methods=['POST'])
def signup_customer():

    data = request.json
    required = ['name', 'email', 'phone', 'password']
    missing = missing_fields(data, required)

    if missing:
        return jsonify({'message': f'Missing fields: {", ".join(missing)}'}), 400

    if customers_collection.find_one({"email": data["email"]}):
        return jsonify({'message': 'Email already exists'}), 409

    customers_collection.insert_one(data)

    return jsonify({'message': 'Customer signup successful!'}), 201


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


@app.route('/signup/delivery', methods=['POST'])
def signup_delivery():

    data = request.json
    required = ['name', 'email', 'phone', 'city', 'vehicle_type', 'password']
    missing = missing_fields(data, required)

    if missing:
        return jsonify({'message': f'Missing fields: {", ".join(missing)}'}), 400

    if delivery_collection.find_one({"email": data["email"]}):
        return jsonify({'message': 'Email already exists'}), 409

    delivery_collection.insert_one(data)

    return jsonify({'message': 'Delivery partner signup successful!'}), 201


# ─────────────────────────────────────────────────────────────
# LOGIN ENDPOINTS
# ─────────────────────────────────────────────────────────────

@app.route('/login/customer', methods=['POST'])
def login_customer():

    data = request.json

    user = customers_collection.find_one({
        "email": data.get("email"),
        "password": data.get("password")
    })

    if user:
        return jsonify({'message': 'Customer login successful!'}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


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


@app.route('/login/delivery', methods=['POST'])
def login_delivery():

    data = request.json

    user = delivery_collection.find_one({
        "email": data.get("email"),
        "password": data.get("password")
    })

    if user:
        return jsonify({'message': 'Delivery partner login successful!'}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/login/manufacturer', methods=['POST'])
def login_manufacturer():

    data = request.json

    user = manufacturers_collection.find_one({
        "email": data.get("email"),
        "password": data.get("password")
    })

    if user:
        return jsonify({"success": True, "message": "Manufacturer login successful"}), 200

    return jsonify({"success": False, "message": "Invalid credentials"}), 401


# ─────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(debug=True, port=5000)