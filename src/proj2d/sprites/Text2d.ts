import { Text, TextStyle } from '@pixi/text';
import { Projection2d } from '../Projection2d';
import { Sprite2d } from './Sprite2d';
import { Matrix } from '@pixi/math';

export class Text2d extends Text
{
    constructor(text?: string, style?: TextStyle, canvas?: HTMLCanvasElement)
    {
        super(text, style, canvas);
        this.proj = new Projection2d(this.transform);
        this.pluginName = 'batch2d';
    }

    proj: Projection2d;
    vertexData2d: Float32Array = null;

    get worldTransform(): Matrix
    {
        return this.proj.affine ? this.transform.worldTransform : this.proj.world as any;
    }
}

Text2d.prototype.calculateVertices = Sprite2d.prototype.calculateVertices;
Text2d.prototype.calculateTrimmedVertices = Sprite2d.prototype.calculateTrimmedVertices;
(Text2d.prototype as any)._calculateBounds = Sprite2d.prototype._calculateBounds;
