import { Projection2d } from './Projection2d';
import { Container, DisplayObject } from '@pixi/display';
import { IPointData, Matrix, Point } from '@pixi/math';
import { TRANSFORM_STEP } from '../base';

export function container2dWorldTransform(): Matrix
{
    return this.proj.affine ? this.transform.worldTransform : this.proj.world as any;
}

export class Container2d extends Container
{
    constructor()
    {
        super();
        this.proj = new Projection2d(this.transform);
    }

    proj: Projection2d;

    toLocal<P extends IPointData = Point>(position: IPointData, from?: DisplayObject, point?: P, skipUpdate?: boolean,
        step = TRANSFORM_STEP.ALL): P
    {
        if (from)
        {
            position = from.toGlobal(position, point, skipUpdate);
        }

        if (!skipUpdate)
        {
            this._recursivePostUpdateTransform();
        }

        if (step >= TRANSFORM_STEP.PROJ)
        {
            if (!skipUpdate)
            {
                this.displayObjectUpdateTransform();
            }
            if (this.proj.affine)
            {
                return this.transform.worldTransform.applyInverse(position, point) as any;
            }

            return this.proj.world.applyInverse(position, point) as any;
        }

        if (this.parent)
        {
            point = this.parent.worldTransform.applyInverse(position, point) as any;
        }
        else
        {
            point.x = position.x;
            point.y = position.y;
        }
        if (step === TRANSFORM_STEP.NONE)
        {
            return point;
        }

        return this.transform.localTransform.applyInverse(point, point) as any;
    }

    get worldTransform(): Matrix
    {
        return this.proj.affine ? this.transform.worldTransform : this.proj.world as any;
    }
}

export const container2dToLocal = Container2d.prototype.toLocal;
