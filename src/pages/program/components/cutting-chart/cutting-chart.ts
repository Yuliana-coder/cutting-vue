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
  scaleFactor = 1; //коэфф-т на которой умноожаются все числовые значения с целью масштабирования
  canvasCount = 0; //количество затраченных листов
  paperParamsInput: IPaperParams = {
    //входные параметры-характеристики листа материала для раскроя
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

  blanksList: any[] = []; //список деталей
  blanksCount: number = 0;
  isShowCutting: boolean = false;
  currentPaper: any = 1;
  bestSolutionValue: any = 1000000000;
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
      width: Number(this.paperParamsInput.width * this.scaleFactor),
      height: Number(this.paperParamsInput.height * this.scaleFactor),
      allowanceBorder: Number(
        this.paperParamsInput.allowanceBorder * this.scaleFactor
      )
    };
  }

  get allowanceBlankParams() {
    return {
      cut: Number(this.allowanceBlank.cut * this.scaleFactor),
      blankBorder: Number(this.allowanceBlank.blankBorder * this.scaleFactor)
    };
  }

  get blanksListParams() {
    return this.blanksList.map((item: any) => {
      return {
        width: Number(item.width * this.scaleFactor),
        height: Number(item.height * this.scaleFactor),
        id: item.id
      };
    });
  }

  mounted() {
    // this.canvas = document.getElementById(`myCanvas0`);
    // this.canvas.width = 900;
    // this.canvas.height = 555;
    // let context = this.canvas.getContext("2d");
    // if (context) {
    // context.strokeRect(0, 0, 50, 50);
    // context.strokeRect(55, 0, 50, 100);
    // context.font = 'bold 24px serif';
    // context.fillText(String(2), 65, 35);
    // }
  }

  //подсчет коэффициента масштабирования
  countScale() {
    this.scaleFactor = 1;
    if (
      Number(this.paperParamsInput.width) > MAX_WIDTH_PAPER ||
      Number(this.paperParamsInput.height) > MAX_HEIGHT_PAPER
    ) {
      if (
        Number(this.paperParamsInput.width) >
        Number(this.paperParamsInput.height)
      ) {
        this.scaleFactor =
          MAX_WIDTH_PAPER / Number(this.paperParamsInput.width);
      } else {
        this.scaleFactor =
          MAX_HEIGHT_PAPER / Number(this.paperParamsInput.height);
      }
    }

    for (let i = 0; i < this.canvasCount; i++) {
      let canvasElement: any = document.getElementById(`myCanvas${i}`);
      canvasElement.style.width = this.paperParams.width + "px";
      canvasElement.style.height = this.paperParams.height + "px";
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

    this.canvasCount = this.canvasCount + 1;
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  isNotCrossRigthBlanks(blank, position) {
    let isCross: any = false;

    if (
      position.x + blank.width + this.allowanceBlankParams.cut <
      position.borderX
    ) {
      for (let i = 0; i < this.currentSolution.length; i++) {
        //смотрим на пересечение заготовок на однов вертикальном уровне
        if (
          position.y >= this.currentSolution[i].y &&
          position.y <=
            this.currentSolution[i].y + this.currentSolution[i].height
        ) {
          if (
            this.currentSolution[i].x > position.x &&
            position.x + blank.width + this.allowanceBlankParams.cut >
              this.currentSolution[i].x
          ) {
            isCross = true;
            break;
          }
        }
      }
    } else {
      isCross = true;
    }

    return isCross;
  }

  //определяет может ли заготовка быть размещена на данную позицию
  isCanBeArranged(blank, position) {
    //проверка на возможность расположить заготовку в текущую позицию
    let isCan: any = false;
    //если ширина заготовки не выходит за правую границу
    if (!this.isNotCrossRigthBlanks(blank, position)) {
      //если ширина заготовки не выходит за верхнюю границу
      let isHaveBottomElement: any = false;

      //если под заготовкой есть детали, то в пределах ширины нельзя персечься с заготовкой
      for (let i = 0; i < this.currentSolution.length; i++) {
        if (this.currentSolution[i].y > position.y) {
          //смотрим на зготовки с которыми можем персечься, то есть в пределах ширины
          if (
            position.x >= this.currentSolution[i].x &&
            position.x <=
              this.currentSolution[i].x + this.currentSolution[i].width
          ) {
            isHaveBottomElement = true;
            if (
              this.currentSolution[i].y >
              position.y + blank.height + this.allowanceBlankParams.cut
            ) {
              isCan = true;
            } else {
              isCan = false;
              break;
            }
          }
        }
      }

      //если под текущей позицией нет заготовок, то смотрим не выходит ли заготовки за пределы листа по высоте
      if (!isHaveBottomElement) {
        if (
          position.y + blank.height + this.allowanceBlankParams.cut >
          this.paperParams.height - this.paperParams.allowanceBorder
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
  rigthBorderByTopBlank(pointX) {
    let borderX = this.paperParams.width - this.paperParams.allowanceBorder;
    for (let i = 0; i < this.currentSolution.length; i++) {
      if (this.currentSolution[i].y === this.paperParams.allowanceBorder) {
        if (
          pointX >= this.currentSolution[i].x &&
          pointX <= this.currentSolution[i].x + this.currentSolution[i].width
        ) {
          borderX = this.currentSolution[i].x + this.currentSolution[i].width;
        }
      }
    }

    return borderX;
  }

  byField(field) {
    return (a, b) => (a[field] > b[field] ? 1 : -1);
  }

  decodingProcedure(solution) {
    //список заготовок текущего листа
    this.currentSolution = [];
    //тот же самый список деталей, но уже с координатами для отрисовки
    for (let i = this.lastArrangedBlank; i < solution.length; i++) {
      let isFindPosition = false;

      for (let j = 0; j < this.positionsList.length; j++) {
        //если можно разместить на текущем листе заготовку, зададим ей координаты допустимой позиции
        //если ширина текущей заготовки не выходит за ширину границы
        //если высота зготовки не выходит за нижнюю границу
        if (
          this.isCanBeArranged(
            this.blanksListParams[solution[i]],
            this.positionsList[j]
          )
        ) {
          this.currentSolution.push({
            x: this.positionsList[j].x,
            y: this.positionsList[j].y,
            width: this.blanksListParams[solution[i]].width,
            height: this.blanksListParams[solution[i]].height,
            id: solution[i]
          });

          //нижняя заготовка
          this.positionsList.push({
            x: this.positionsList[j].x,
            y:
              this.positionsList[j].y +
              this.blanksListParams[solution[i]].height +
              this.allowanceBlankParams.cut,
            borderX: this.rigthBorderByTopBlank(this.positionsList[j].x)
          });

          //правая заготовка
          this.positionsList.push({
            x:
              this.positionsList[j].x +
              this.blanksListParams[solution[i]].width +
              this.allowanceBlankParams.cut,
            y: this.positionsList[j].y,
            borderX: this.rigthBorderByTopBlank(
              this.positionsList[j].x +
                this.blanksListParams[solution[i]].width +
                this.allowanceBlankParams.cut
            )
          });

          this.positionsList.splice(j, 1);
          //отсортировать по y приоритетный список
          // this.positionsList.sort(this.byField("y")).reverse();
          this.positionsList = this.positionsList.sort(function(a, b) {
            return a.y - b.y || a.x - b.x;
          });
          isFindPosition = true;
          break;
        }
      }

      //если для текущей заготовки не нашлось позиции
      if (!isFindPosition) {
        //начинаем новый лист, располагаем там
        this.currentPaper = this.currentPaper + 1;
        //делитим список допустимых позиций, начинаем приоритетный список с последней на размещенной фигуры
        this.positionsList = [
          {
            x: this.paperParams.allowanceBorder,
            y: this.paperParams.allowanceBorder,
            borderX: this.paperParams.width - this.paperParams.allowanceBorder
          }
        ];
        if (this.currentSolution && this.currentSolution.length) {
          this.finalySolution.push(this.currentSolution);
        }
        this.lastArrangedBlank = i;
        break;
      } else if (i === solution.length - 1) {
        if (this.currentSolution && this.currentSolution.length) {
          this.finalySolution.push(this.currentSolution);
        }
      }

      //так, пока каждая деталь не будет размещена, на выходе получаем blanksList с координатами
      //и количество затраченных листов = целевая функция
      //сравниваем с рекордами и при лучшем решении заменяем текущие лучшие, ищем окрестности и продожаем
      //декодирующие процедуры
    }
  }

  algorithmWork() {
    //приоритетный список, первое решение - рандомный список заготовок
    let solution: any = [];
    //список доступных позиций, первая позиций - начало координат
    this.positionsList = [
      {
        x: this.paperParams.allowanceBorder,
        y: this.paperParams.allowanceBorder,
        borderX: this.paperParams.width - this.paperParams.allowanceBorder
      }
    ];
    //количество итераций
    let iteretionsCount = 1;

    for (let i = 0; i < this.blanksListParams.length; i++) {
      solution.push(this.blanksListParams[i].id - 1);
    }

    this.shuffle(solution);

    while (iteretionsCount > 0) {
      iteretionsCount = iteretionsCount - 1;
      while (this.finalySolutionLength != this.blanksListParams.length) {
        this.decodingProcedure(solution);
      }

      //поменять приоритетный список  с окрестностью
      if (this.currentPaper < this.bestSolutionValue) {
        this.bestSolutionValue = this.currentPaper;
        this.bestSolution = this.finalySolution;
      }
    }

    this.drawBestSolution();
  }

  get finalySolutionLength() {
    let length = 0;

    this.finalySolution.forEach(element => {
      length = length + element.length;
    });

    return length;
  }

  drawBestSolution() {
    for (let i = 0; i < this.currentPaper; i++) {
      this.addCanvas();
    }
    for (let i = 0; i < this.currentPaper; i++) {
      let canvasElement: any = document.getElementById(`myCanvas${i}`);
      canvasElement.width = this.paperParams.width;
      canvasElement.height = this.paperParams.height;

      this.canvas = canvasElement;

      let context = this.canvas.getContext("2d");
      context.font = "48px";
      if (context && this.bestSolution[i] && this.bestSolution[i].length) {
        for (let j = 0; j < this.bestSolution[i].length; j++) {
          context.strokeRect(
            parseInt(this.bestSolution[i][j].x),
            parseInt(this.bestSolution[i][j].y),
            parseInt(this.bestSolution[i][j].width),
            parseInt(this.bestSolution[i][j].height)
          );

          context.font = "bold 24px serif";

          context.fillText(
            String(this.bestSolution[i][j].id + 1),
            parseInt(this.bestSolution[i][j].x + 20),
            parseInt(this.bestSolution[i][j].y + 20)
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
