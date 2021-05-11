import { Vue, Component, Watch } from "vue-property-decorator";
import { IPaperParams, IBlankParams } from "@/pages/program/interfaces";

const MAX_WIDTH_PAPER = 1000;
const MAX_HEIGHT_PAPER = 600;

@Component
export default class CuttingChart extends Vue {
  TABS = {
    params: 1,
    cutting: 2
  };

  currentTab = this.TABS.params;

  canvas = <HTMLCanvasElement>{};
  scaleFactor = 1; // коэфф-т на которой умноожаются все числовые значения с целью масштабирования
  canvasCount = 1; // количество затраченных листов
  paperParamsInput: IPaperParams = {
    // входные параметры-характеристики листа материала для раскроя
    width: 0,
    height: 0,
    allowanceBorder: 0
  };
  allowanceBlank: any = {
    cut: 0,
    blankBorder: 0
  };
  blankParamsInput: IBlankParams = {
    width: 0,
    height: 0
  };

  blanksList: any[] = []; // список деталей
  blanksCount: number = 0;
  isShowCutting: boolean = false;
  currentPaper = 0;

  get paperParams() {
    return {
      width: this.paperParamsInput.width * this.scaleFactor,
      heigth: this.paperParamsInput.height * this.scaleFactor,
      allowanceBorder: this.paperParamsInput.allowanceBorder * this.scaleFactor
    };
  }

  mounted() {
    this.canvas = <HTMLCanvasElement>this.$refs.canvas0;
    const canvasWidth = window.innerWidth;
    this.canvas.width = canvasWidth * (7 / 10) - 20;
    this.canvas.height = 555;
    let context = this.canvas.getContext("2d");
    if (context) {
      context.strokeRect(0, 0, 50, 50);
      context.strokeRect(55, 0, 50, 100);
      context.fillText(String(2), 55, 15);
    }
  }

  countScale() {
    this.scaleFactor = 1;
    if (
      this.paperParamsInput.width > MAX_WIDTH_PAPER ||
      this.paperParamsInput.height > MAX_HEIGHT_PAPER
    ) {
      if (
        Number(this.paperParamsInput.width) >
        Number(this.paperParamsInput.height)
      ) {
        this.scaleFactor = MAX_WIDTH_PAPER / this.paperParamsInput.width;
        // console.log(this.scaleFactor, ">");
      } else {
        this.scaleFactor = MAX_HEIGHT_PAPER / this.paperParamsInput.height;
        // console.log(this.scaleFactor, "<");
      }
    }

    // console.log(this.scaleFactor);
    for (let i = 0; i < this.canvasCount; i++) {
      let canvasElement: any = document.getElementById(`myCanvas${i}`);
      //   console.log(canvasElement.width);
      canvasElement.style.width = this.paperParams.width + "px";
      //   console.log(canvasElement.width);
      canvasElement.style.height = this.paperParams.heigth + "px";
    }

    this.isShowCutting = true;
  }

  get generateBlankId() {
    let result: any = null;
    let adder = 1;
    while (!result) {
      let filterBlanks = this.blanksList.filter((item: any) => {
        return item.id != this.blanksList.length + adder;
      });
      if (this.blanksList.length === filterBlanks.length) {
        result = this.blanksList.length + adder;
      } else {
        adder = adder + 1;
      }
    }
    return result;
  }

  addToBlanksList() {
    this.blanksList.push({
      ...this.blankParamsInput,
      id: this.generateBlankId
    });
    this.blankParamsInput = { width: 0, height: 0 };
  }

  deleteBlank(id: number) {
    this.blanksList = this.blanksList.filter((item: any) => {
      return item.id != id;
    });
  }

  get isNotAllFieldsFilled() {
    return Boolean(
      this.paperParamsInput.width &&
        this.paperParamsInput.height &&
        this.blanksList &&
        this.blanksList.length
    );
  }

  addCanvas() {
    let numberPaper = this.canvasCount;
    let newPaper = `<div class="cutting-chart__canvas-wrapper">
        <canvas ref="canvas${numberPaper}" id="myCanvas${numberPaper}" class="cutting-chart__canvas">
        </canvas>
    </div>`;

    let canvasList = document.querySelector(".canvas__wrapper");
    if (canvasList) canvasList.innerHTML += newPaper;

    // this.$refs[`canvas${numberPaper}`] = document.getElementById(`myCanvas${this.canvasCount}`);

    this.canvasCount = this.canvasCount + 1;
  }
}
