import { Vue, Component, Watch } from "vue-property-decorator";
import { IPaperParams } from "@/pages/program/interfaces"

const MAX_WIDTH_PAPER = 1000;
const MAX_HEIGHT_PAPER = 650;

@Component
export default class CuttingChart extends Vue {

    canvas = <HTMLCanvasElement>{}; 
    scaleFactor = 1; // коэфф-т на которой умноожаются все числовые значения с целью масштабирования
    paperParamsInput: IPaperParams = { // входные параметры-характеристики листа материала для раскроя
        width: 0,
        height: 0,
        allowanceBorder: 0
    };
    blanksList: any = []; // список деталей 
    blanksCount: number = 0;

    get paperParams() {
        return {
            width: this.paperParamsInput.width * this.scaleFactor,
            heigth: this.paperParamsInput.height * this.scaleFactor,
            allowanceBorder: this.paperParamsInput.allowanceBorder * this.scaleFactor
        }
    }

    mounted() {
        this.canvas = <HTMLCanvasElement> this.$refs.canvas;
        const canvasWidth = window.innerWidth;
        this.canvas.width = canvasWidth* (7 / 10) - 20;
        this.canvas.height = 555;
        let context = this.canvas.getContext("2d");
        if(context) {    
            context.strokeRect(0, 0, 50, 50);
            context.strokeRect(55, 0, 50, 100);
            context.fillText(String(2), 55, 15);
        }
    }

    countScale() {
        this.scaleFactor = 1;
        if((this.paperParamsInput.width > MAX_WIDTH_PAPER) || (this.paperParamsInput.height > MAX_HEIGHT_PAPER)) {
            if(Number(this.paperParamsInput.width) > Number(this.paperParamsInput.height)) {
                this.scaleFactor = MAX_WIDTH_PAPER / this.paperParamsInput.width;
                console.log(this.scaleFactor, ">");
            }else {
                this.scaleFactor = MAX_HEIGHT_PAPER / this.paperParamsInput.height;
                console.log(this.scaleFactor, "<");
            }
        }
        this.canvas.width = this.paperParams.width;
        this.canvas.height = this.paperParams.heigth;
    }
}
