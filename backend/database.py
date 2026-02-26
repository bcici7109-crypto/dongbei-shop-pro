import sqlite3

DB_FILE = "dongbei_shop.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 1. 用户表
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, address TEXT, email TEXT)''')
        
    # 2. 商品表 (新增了 category 字段用于亚马逊式的分类检索)
    cursor.execute('''CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, name TEXT, subtitle TEXT, description TEXT, price REAL, image TEXT, tags TEXT)''')
        
    # 3. 购物车表
    cursor.execute('''CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, product_id INTEGER, quantity INTEGER DEFAULT 1,
        FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(product_id) REFERENCES products(id))''')
        
    # 4. 订单表
    cursor.execute('''CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total REAL, status TEXT DEFAULT '待付款', created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id))''')
        
    # 5. 订单详情表
    cursor.execute('''CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, product_id INTEGER, quantity INTEGER, price REAL,
        FOREIGN KEY(order_id) REFERENCES orders(id), FOREIGN KEY(product_id) REFERENCES products(id))''')

    # 插入默认测试用户
    cursor.execute("SELECT * FROM users WHERE id = 1")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO users (id, name, phone, address, email) VALUES (1, '东北老铁', '13800000000', '黑龙江省哈尔滨市道里区', 'user@dongbei.com')")

    # 插入全新的 12 个商品数据 (指向本地 public/images 文件夹)
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        products = [
            # 🍎 水果品类 (Fruits)
            ("特色鲜果", "正宗东北冻梨", "冰凉解腻 传统特色", "精选秋子梨，自然冰冻，化冻后酸甜多汁，是冬季最地道的清口甜品。", 35.0, "/images/dongli.jpg", "时令,生鲜,冰爽"),
            ("特色鲜果", "东北老式冻柿子", "清甜软糯 冰镇口感", "东北特色冻柿子，果肉如同冰沙般绵密，甜度极高，室温微化后用勺子挖着吃绝佳。", 29.9, "/images/dongshizi.jpg", "甜点,冰沙口感"),
            ("特色鲜果", "丹东99红颜草莓", "产地直发 个大味甜", "辽宁丹东特产，个大味甜，奶香浓郁，入口即化，全程冷链顺丰直达。", 88.0, "/images/caomei.jpg", "鲜甜,爆款,冷链"),
            ("特色鲜果", "延边特产苹果梨", "汁多无渣 脆甜可口", "吉林延边特产，结合了苹果的爽脆与梨的多汁，果肉雪白，解渴生津。", 45.0, "/images/pingguoli.jpg", "爽脆,多汁,助消化"),

            # 🍖 熏制品类 (Smoked)
            ("经典熏酱", "哈尔滨秋林里道斯红肠", "百年老字号 果木熏烤", "肥瘦相间，蒜香浓郁，经过多道传统工序熏烤而成，是地道东北餐桌的灵魂。", 68.9, "/images/hongchang.jpg", "老字号,肉类,熟食"),
            ("经典熏酱", "东北纯肉风干香肠", "越嚼越香 传统手工", "精选农家土猪肉，自然风干，肉质紧实，咸香微甜，下酒追剧绝配。", 75.0, "/images/xiangchang.jpg", "下酒菜,特产,零食"),
            ("经典熏酱", "哈尔滨百年熏酱排骨", "肉质酥烂 酱香浓郁", "老汤慢炖入味，辅以果木微熏，骨酥肉烂，回味无穷，开袋即食或加热均可。", 89.0, "/images/paigu.jpg", "硬菜,熟食,宴请"),
            ("经典熏酱", "东北老式大酱骨", "大块吃肉 满口骨髓", "东北名菜酱骨架，肉多筋糯，配赠吸管吸食骨髓，给您带来极致的吃肉享受。", 65.0, "/images/jianggujia.jpg", "招牌菜,肉食动物"),

            # 🍄 山珍品类 (Mountain)
            ("珍稀山货", "五常稻花香2号大米", "核心产区 当季新米", "纯正五常核心产区有机种植，颗粒饱满，开锅满屋飘香，剩饭不回生。", 128.0, "/images/dami.jpg", "主打,有机,主食"),
            ("珍稀山货", "大兴安岭野生秋木耳", "肉厚脆耳 纯净无根", "源自黑土地的野生小碗耳，泡发率极高，口感爽脆，凉拌爆炒皆为上品。", 58.0, "/images/muer.jpg", "野生,干货,营养"),
            ("珍稀山货", "野生带根榛蘑", "东北山珍 炖鸡绝配", "纯野生采摘，自然晾晒，保留了大森林最原始的鲜美气息，小鸡炖蘑菇必备。", 85.0, "/images/zhenmo.jpg", "鲜美,特产,干货"),
            ("珍稀山货", "长白山特级人参", "百草之王 滋补佳品", "源自长白山深处，参龄足，根须完整，皂苷含量高，自用泡酒或送礼优选。", 299.0, "/images/rensheng.jpg", "滋补,送礼,名贵")
        ]
        cursor.executemany("INSERT INTO products (category, name, subtitle, description, price, image, tags) VALUES (?, ?, ?, ?, ?, ?, ?)", products)
        
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn