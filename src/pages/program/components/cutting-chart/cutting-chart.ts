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

  canvas: any = null;
  scaleFactor = 1; // коэфф-т на которой умноожаются все числовые значения с целью масштабирования
  canvasCount = 0; // количество затраченных листов
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
  currentPaper: any = 1;
  bestSolutionValue: any = 1;
  bestSolution: any = [];
  tabuList: any = [];
  currentSolution: any = []; //список деталей с координатами позиций для отрисовки
  //содержит список список деталей, где индекс это номер листа материала (канваса)
  finalySolution: any = [];

  //список допустимых позиций
  positionsList: any = [];

  lastArrangedBlank: any = 0;

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
    // this.canvas = <HTMLCanvasElement>this.$refs.canvas0;
    // this.canvas = document.getElementById(`myCanvas1`);
    // this.canvas.width = 900;
    // this.canvas.height = 555;
    // let context = this.canvas.getContext("2d");
    // if (context) {
    //   context.strokeRect(0, 0, 50, 50);
    //   context.strokeRect(55, 0, 50, 100);
    //   context.fillText(String(2), 55, 15);
    // }
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

  //определяет может ли заготовка быть размещена на данную похицию
  isCanBeArranged(blank, position) {
    //проверка на возможность расположить заготовку в текущую позицию
    let isCan: any = false;
    //если ширина заготовки не выходит за правую границу
    if (position.x + blank.width > position.borderX) {
      //если ширина заготовки не выходит за верхнюю границу
      let isHaveBottomElement: any = false;
      //если под заготовкой есть детали, то в пределах ширины нельзя персечься с заготовкой
      this.currentSolution.forEach(element => {
        if (element.y < position.y) {
          //смотрим на зготовки с которыми можем персечься, то есть в пределах ширины
          if (
            position.x >= element.x &&
            position.x < element.x + element.width
          ) {
            isHaveBottomElement = true;
            if (
              element.y <
              position.y + blank.heigth + this.allowanceBlankParams.cut
            ) {
              isCan = true;
            } else {
              isCan = false;
            }
          }
        }
      });
      // если под текущей позицией нет заготовок, то смотрим не выходит ли заготовки за пределы листа по высоте
      if (!isHaveBottomElement) {
        if (
          position.y + blank.heigth + this.allowanceBlankParams.cut >
          this.paperParams.heigth - this.paperParams.allowanceBorder
        ) {
          isCan = false;
        } else {
          isCan = true;
        }
      }
    }
    return isCan;
  }

  //возвращает правую границу по верхней заготовке или правую границу листа материала
  rigthBorderByTopBlank(pointX, pointY) {
    let borderX = this.paperParams.width - this.paperParams.allowanceBorder;
    for (let i = 0; i < this.currentSolution.length; i++) {
      if (this.currentSolution[i].y === this.paperParams.allowanceBorder) {
        if (
          pointX >= this.currentSolution[i].x &&
          pointY <= this.currentSolution[i].x + this.currentSolution.width
        ) {
          borderX =
            this.currentSolution[i].x +
            this.currentSolution.width +
            this.allowanceBlankParams.cut;
        }
      }
    }

    return borderX;
  }

  decodingProcedure(solution) {
    this.currentSolution = this.blanksListParams;
    // тот же самый список деталей, но уже с координатами для отрисовки
    let lastArregned = 0;
    for (let i = this.lastArrangedBlank; i < solution.length; i++) {
      let isFindPosition = false;

      for (let j = 0; j < this.positionsList.length; j++) {
        //если можно разместить на текущем листе заготовку, зададим ей координаты допустимой позиции
        //если ширина текущей заготовки не выходит за ширину границы
        //если высота зготовки не выходит за нижнюю границу
        if (
          this.isCanBeArranged(
            this.currentSolution[solution[i]],
            this.positionsList[j]
          )
        ) {
          this.currentSolution[solution[i]].x = this.positionsList[j].x;
          this.currentSolution[solution[i]].y = this.positionsList[j].y;
          //правая заготовка
          this.positionsList.push({
            x: (
              Number(this.positionsList[j].x) +
              this.currentSolution[solution[i]].width +
              this.allowanceBlankParams.cut
            ).toString(),
            y: this.currentSolution[solution[i]].y,
            borderX: this.rigthBorderByTopBlank(
              this.positionsList[j].x +
                this.currentSolution[solution[i]].width +
                this.allowanceBlankParams.cut,
              this.currentSolution[solution[i]].y
            )
          });
          //нижняя заготовка
          this.positionsList.push({
            x: this.currentSolution[solution[i]].x,
            y: (
              Number(this.positionsList[j].y) +
              this.currentSolution[solution[i]].height +
              this.allowanceBlankParams.cut
            ).toString(),
            borderX: this.rigthBorderByTopBlank(
              this.positionsList[j].x,
              this.positionsList[j].y +
                this.currentSolution[solution[i]].height +
                this.allowanceBlankParams.cut
            )
          });

          this.positionsList.splice(j, 1);
          isFindPosition = true;
          lastArregned = i;
          break;
        }
      }

      if (!isFindPosition) {
        this.lastArrangedBlank = lastArregned;
        //начинаем новый лист, располагаем там
        this.currentPaper = this.currentPaper + 1;
        //делитим список допустимых позиций, начинаем приоритетный список с последней на размещенной фигуры
        this.positionsList = [
          {
            x: this.paperParamsInput.allowanceBorder,
            y: this.paperParamsInput.allowanceBorder
          }
        ];
        break;
      } else {
        this.finalySolution = [this.currentSolution];
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
        y: this.paperParamsInput.allowanceBorder,
        borderX: this.paperParams.width - this.paperParams.allowanceBorder
      }
    ];
    // количество итераций
    let iteretionsCount = 1;

    for (let i = 0; i < this.blanksList.length; i++) {
      solution.push(i);
    }

    this.shuffle(solution);

    // this.blanksList = this.blanksListParams;

    while (iteretionsCount > 0) {
      iteretionsCount = iteretionsCount - 1;
      this.decodingProcedure(solution);
      //поменять приоритетный список  с окрестностью
      if (this.currentPaper < this.bestSolutionValue) {
        this.bestSolutionValue = this.currentPaper;
        this.bestSolution = this.currentSolution;
      }
    }

    this.drawBestSolution();
  }

  drawBestSolution() {
    for (let i = 0; i < this.currentPaper; i++) {
      this.addCanvas();
      let canvasElement: any = document.getElementById(`myCanvas${i}`);
      canvasElement.width = this.paperParams.width;
      canvasElement.height = this.paperParams.heigth;
      // debugger

      this.canvas = canvasElement;

      let context = this.canvas.getContext("2d");
      if (context) {
        for (let j = 0; j < this.finalySolution[i].length; j++) {
          context.strokeRect(
            parseInt(this.finalySolution[i][j].x),
            parseInt(this.finalySolution[i][j].y),
            parseInt(this.finalySolution[i][j].width),
            parseInt(this.finalySolution[i][j].height)
          );

          context.fillText(
            String(j),
            parseInt(this.finalySolution[i][j].x),
            parseInt(this.finalySolution[i][j].y)
          );
        }
      }
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
