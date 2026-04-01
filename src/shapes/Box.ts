/**
 * Box - Axis-Aligned Bounding Box collision shape
 */

import { Shape, ShapeType } from "./Shape";
import { Vec3 } from "../math/Vec3";

export class Box extends Shape {
    public min: Vec3;
    public max: Vec3;
    public position: Vec3;
    public halfExtents: Vec3;

    constructor(position: Vec3 = Vec3.zero(), halfExtents: Vec3 = new Vec3(1, 1, 1)) {
        super(ShapeType.BOX);
        this.position = position.clone();
        this.halfExtents = halfExtents.clone();
        this.min = position.subtract(halfExtents);
        this.max = position.add(halfExtents);
    }

    getCenter(): Vec3 {
        return this.position.clone();
    }

    getBounds(): { min: Vec3; max: Vec3 } {
        return {
            min: this.min.clone(),
            max: this.max.clone()
        };
    }

    support(direction: Vec3): Vec3 {
        return new Vec3(
            direction.x > 0 ? this.max.x : this.min.x,
            direction.y > 0 ? this.max.y : this.min.y,
            direction.z > 0 ? this.max.z : this.min.z
        );
    }

    setPosition(pos: Vec3): this {
        this.position.copy(pos);
        this.min = this.position.subtract(this.halfExtents);
        this.max = this.position.add(this.halfExtents);
        return this;
    }

    setHalfExtents(extents: Vec3): this {
        this.halfExtents.copy(extents);
        this.min = this.position.subtract(this.halfExtents);
        this.max = this.position.add(this.halfExtents);
        return this;
    }
}