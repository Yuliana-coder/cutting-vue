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

  //список допустимых позиций
  positionsList: any = [];

  get paperParams() {
    return {
      width: this.paperParamsInput.width * this.scaleFactor,
      heigth: this.paperParamsInput.height * this.scaleFactor,
      allowanceBorder: this.paperParamsInput.allowanceBorder * this.scaleFactor
    };
  }

  get allowanceBlankParams() {
    return {
      cut: this.allowanceBlank.cut * this.scaleFactor,
      blankBorder: this.allowanceBlank.blankBorder * this.scaleFactor
    };
  }

  get blanksListParams() {
    return this.blanksList.map((item: any) => {
      return {
        width: item.width * this.scaleFactor,
        height: item.height * this.scaleFactor,
        id: this.blanksList.indexOf(item)
      };
    });
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
      } else {
        this.scaleFactor = MAX_HEIGHT_PAPER / this.paperParamsInput.height;
      }
    }

    for (let i = 0; i < this.canvasCount; i++) {
      let canvasElement: any = document.getElementById(`myCanvas${i}`);
      canvasElement.style.width = this.paperParams.width + "px";
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

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  isCanBeArranged() {
    //проверка на возможность расположить заготовку в текущую позицию
    //реализовать!!!!!!
    return true;
  }

  decodingProcedure(solution) {
    for (let i = 0; i < solution.length; i++) {
      let isFindPosition = false;
      for (let j = 0; j < this.positionsList.length; j++) {
        if (this.isCanBeArranged()) {
          this.blanksList[solution[i]].x = this.positionsList[j].x;
          this.blanksList[solution[i]].y = this.positionsList[j].y;
          isFindPosition = true;
          break;
        }
      }

      if (!isFindPosition) {
        //начинаем новый лист, располагаем там
        //делитим список допустимых позиций, начинаем приоритетный список с последней на размещенной фигуры
      }

      //так, пока каждая деталь не будет размещена, на выходе получаем blanksList с координатами
      //и количество затраченных листов = целевая функция
      //сравниваем с рекордами и при лучшем решении заменяем текущие лучшие, ищем окрестности и продожаем
      //декодирующие процедуры
    }
  }

  algorithmWork() {
    // приоритетный список, первое решение - рандомный список заготовок
    let solution: any = [];
    // список доступных позиций, первая позиций - начало координат
    this.positionsList = [
      {
        x: this.paperParamsInput.allowanceBorder,
        y: this.paperParamsInput.allowanceBorder
      }
    ];
    // количество итераций
    let iteretionsCount = 10;

    for (let i = 0; i < this.blanksList.length; i++) {
      solution.push(i);
    }

    this.shuffle(solution);

    this.blanksList = this.blanksListParams;

    while (iteretionsCount > 0) {
      iteretionsCount = iteretionsCount - 1;
      this.decodingProcedure(solution);
    }
  }

  get file() {
    return <any>this.$refs["file"];
  }

  loadData() {
    let file: any = this.file.files[0];
    let reader: any = new FileReader();
    reader.readAsText(file);
    const program = this;
    let arr: any = [];
    reader.onload = function() {
      if (!reader.result) {
        alert("Вы не загрузили файл");
      } else {
        let data = JSON.stringify(reader.result);
        let adder: any = 1;
        reader.result.split(/\r?\n/).forEach(element => {
          let elementArr: any = element.split(" ").map((item: any) => {
            return Number(item);
          });
          arr.push(
            Object({ width: elementArr[0], height: elementArr[1], id: adder })
          );
          adder = adder + 1;
        });
      }
    };

    this.blanksList = arr;
  }

  load() {
    this.file.click();
  }
}
