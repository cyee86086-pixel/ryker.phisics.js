/**
 * Ryker.physics.js - Final Production Version
 * A lightweight, high-performance 3D physics engine.
 * Features: Earth-like Gravity, Friction, AABB Collision, and Velocity Solving.
 */

export const RykerPhysics = (() => {
    // --- النواة الرياضية للمتجهات (Vector Mathematics) ---
    class Vec3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x; this.y = y; this.z = z;
        }
        add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
        sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
        scale(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
        copy() { return new Vec3(this.x, this.y, this.z); }
    }

    // --- كائن الجسم الفيزيائي (Physical Body) ---
    class Body {
        constructor(config = {}) {
            // الموقع والسرعة
            this.position = new Vec3(config.x || 0, config.y || 0, config.z || 0);
            this.velocity = new Vec3(0, 0, 0);
            this.acceleration = new Vec3(0, 0, 0);
            
            // الخصائص الفيزيائية
            this.mass = config.mass || 1.0;
            this.invMass = this.mass > 0 ? 1.0 / this.mass : 0;
            this.friction = config.friction !== undefined ? config.friction : 0.1; 
            this.restitution = config.restitution || 0.2; // مدى القفز/الارتداد
            
            // الأبعاد (للتصادم)
            this.size = new Vec3(config.w || 1, config.h || 1, config.d || 1);
            this.isStatic = config.isStatic || false; // للأرض والجدران الثابتة
        }

        applyForce(f) {
            if (this.isStatic) return;
            this.acceleration.add(new Vec3(f.x * this.invMass, f.y * this.invMass, f.z * this.invMass));
        }

        update(dt, gravity) {
            if (this.isStatic) return;

            // تطبيق الجاذبية (F = m * g)
            this.applyForce(new Vec3(0, gravity * this.mass, 0));

            // التكامل الحركي (Integration)
            this.velocity.add(this.acceleration.copy().scale(dt));
            this.velocity.scale(1.0 - this.friction); // مقاومة الحركة
            this.position.add(this.velocity.copy().scale(dt));

            // تصحيح بسيط لمنع السقوط اللانهائي تحت مستوى الصفر الافتراضي
            if (this.position.y < -100) this.position.y = -100;

            this.acceleration = new Vec3(0, 0, 0);
        }

        getBounds() {
            const r = this.size.copy().scale(0.5);
            return {
                min: new Vec3(this.position.x - r.x, this.position.y - r.y, this.position.z - r.z),
                max: new Vec3(this.position.x + r.x, this.position.y + r.y, this.position.z + r.z)
            };
        }
    }

    // --- مدير العالم الفيزيائي (Physics World Manager) ---
    class World {
        constructor() {
            this.bodies = [];
            this.gravity = -9.81; // جاذبية الأرض الحقيقية
        }

        addBody(body) {
            this.bodies.push(body);
            return body;
        }

        step(dt) {
            // 1. تحديث حركي لكل الأجسام
            for (let body of this.bodies) {
                body.update(dt, this.gravity);
            }

            // 2. حل التصادمات (Collision Solver)
            this._resolveCollisions();
        }

        _resolveCollisions() {
            for (let i = 0; i < this.bodies.length; i++) {
                for (let j = i + 1; j < this.bodies.length; j++) {
                    const a = this.bodies[i];
                    const b = this.bodies[j];

                    if (a.isStatic && b.isStatic) continue;

                    if (this._intersect(a, b)) {
                        this._respond(a, b);
                    }
                }
            }
        }

        _intersect(a, b) {
            const b1 = a.getBounds();
            const b2 = b.getBounds();
            return (b1.min.x <= b2.max.x && b1.max.x >= b2.min.x) &&
                   (b1.min.y <= b2.max.y && b1.max.y >= b2.min.y) &&
                   (b1.min.z <= b2.max.z && b1.max.z >= b2.min.z);
        }

        _respond(a, b) {
            // رد فعل بسيط لمنع التداخل (Penetration Fix)
            if (!a.isStatic && !b.isStatic) {
                a.velocity.y *= -a.restitution;
                b.velocity.y *= -b.restitution;
                a.position.y += 0.05; // دفع بسيط للأعلى لمنع الالتصاق
            } else if (!a.isStatic && b.isStatic) {
                // التصادم مع الأرض أو جدار ثابت
                a.velocity.y *= -a.restitution;
                a.position.y = b.position.y + (b.size.y / 2) + (a.size.y / 2);
            }
        }
    }

    return { World, Body, Vec3 };
})();
