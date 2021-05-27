<template>
  <div class="cutting-chart">
    <div v-if="isShowReport || isShowWarning" class="cutting-chart__modal">
      <template v-if="isShowReport">
        <div class="cutting-chart__modal-btn">
          <button
            class="cutting-chart__modal-btn-close"
            @click="isShowReport = false"
          ></button>
        </div>
        <div class="cutting-chart__modal-info">
          Количество листов для раскроя: {{ bestSolutionValue }}
          <div>
            Показатель эффективности раскроя - коэффициент раскроя - Кр
            <div>Кр: {{ koeffCutting }}</div>
          </div>
        </div>
      </template>
      <template v-else-if="isShowWarning">
        <div class="cutting-chart__modal-warning-wrapper">
          <div class="cutting-chart__modal-warning-wrapper-text">
            Вы уверены, что хотите очистить данные?
          </div>
          <div class="cutting-chart__modal-warning-wrapper-btns">
            <button
              class="btn cutting-chart__modal-warning-wrapper-btns-item"
              @click="clearData"
            >
              Подтвердить
            </button>
            <button
              class="btn cutting-chart__modal-warning-wrapper-btns-item"
              @click="isShowWarning = false"
            >
              Отмена
            </button>
          </div>
        </div>
      </template>
    </div>
    <div
      v-if="finalySolution && finalySolution.length"
      class="cutting-chart-settings"
    >
      <div>
        <button class="btn" @click="isShowReport = true">Отчет</button>
      </div>
      <div>
        <button class="btn" @click="isShowWarning = true">Очистить</button>
      </div>
    </div>
    <div class="cutting-chart-main">
      <div class="cutting-chart__params-wrapper">
        <div class="params__item">
          <button
            :disabled="currentTab === TABS.params"
            class="btn"
            @click="currentTab = TABS.params"
          >
            Параметры раскроя
          </button>
          <button
            :disabled="currentTab === TABS.cutting || !isShowCutting"
            class="btn"
            @click="currentTab = TABS.cutting"
          >
            Раскрой
          </button>
        </div>
        <template v-if="currentTab === TABS.params">
          <div class="params__item">
            <div class="params__item-title">
              Введите размеры одного листа материала
            </div>
            <div class="params__item-input-wrapper">
              <div class="params-field">
                <label class="params-field-label" for="width-input"
                  >Ширина, мм</label
                >
                <input
                  v-model="paperParamsInput.width"
                  min="0"
                  type="number"
                  name="width-input"
                  class="default-input"
                />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="height-input"
                  >Высота, мм</label
                >
                <input
                  v-model="paperParamsInput.height"
                  min="0"
                  type="number"
                  name="height-input"
                  class="default-input"
                />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="allowance-input"
                  >Припуск на окантовку, мм</label
                >
                <input
                  v-model="paperParamsInput.allowanceBorder"
                  min="0"
                  type="number"
                  name="allowance-input"
                  class="default-input"
                />
              </div>
            </div>
          </div>
          <div class="params__item">
            <div class="params__item-title">
              Введите параметры заготовок
            </div>
            <div class="params__item-input-wrapper">
              <div class="params-field">
                <label class="params-field-label" for="cut-input"
                  >Припуск на рез, мм</label
                >
                <input
                  v-model="allowanceBlank.cut"
                  min="0"
                  type="number"
                  name="cut-input"
                  class="default-input"
                />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="blankBorder-input"
                  >Припуск на обработку заготовки, мм</label
                >
                <input
                  v-model="allowanceBlank.blankBorder"
                  min="0"
                  type="number"
                  name="blankBorder-input"
                  class="default-input"
                />
              </div>
              <!-- <div class="params-field params-field_btn-wrapper">
                  <button :disabled="blanksCount=== '0'" class="params-field-btn">Задать размеры заготовок</button>
                </div> -->
            </div>
          </div>
          <div class="params__item">
            <div class="params-field">
              <label class="params-field-label" for="iteretions-input"
                >Количество итераций</label
              >
              <input
                v-model="iteretionsCount"
                min="1"
                type="number"
                name="iteretions-input"
                class="default-input"
              />
            </div>
          </div>
          <div class="params__item params__item-blanks">
            <div class="params__item-title">
              Список заготовок
            </div>
            <div class="params__item-blanks-add-wrapper">
              <div class="params-item-blanks-add-field">
                <label class="params-field-label" for="cut-input"
                  >Ширина, мм</label
                >
                <input
                  v-model="blankParamsInput.width"
                  min="0"
                  type="number"
                  name="cut-input"
                  class="default-input"
                />
              </div>
              <div class="params-item-blanks-add-field">
                <label class="params-field-label" for="blankBordero-input"
                  >Высота, мм</label
                >
                <input
                  v-model="blankParamsInput.height"
                  min="0"
                  type="number"
                  name="blankBordero-input"
                  class="default-input"
                />
              </div>
              <div
                class="params-item-blanks-add-field params-item-blanks-add-field-btn"
              >
                <button
                  :disabled="
                    !(blankParamsInput.width && blankParamsInput.height)
                  "
                  class="btn"
                  @click="addToBlanksList"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <button class="btn" type="info" width="100%" @click="load">
                Загрузить
              </button>
              <input
                id="downloadData"
                ref="file"
                type="file"
                hidden
                @input="loadData"
              />
            </div>
            <div class="params__item-table">
              <table
                v-if="blanksList && blanksList.length"
                class="blanks__table"
              >
                <caption>
                  Список деталей
                </caption>
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">Ширина</th>
                    <th scope="col">Высота</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(blank, key) in blanksList"
                    :key="key"
                    :class="{
                      blanks__table_body_row_error: isErrorBlank(blank)
                    }"
                  >
                    <td>{{ blank.id }}</td>
                    <td>{{ blank.width }}</td>
                    <td>{{ blank.height }}</td>
                    <td>
                      <button class="btn" @click="deleteBlank(blank.id)">
                        Удалить {{ blank.id }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="isHaveBiggerBlank" class="blanks__error-text">
              В списке детали, размеры которых превышают размеры листа материала
              <div>*С учетом припусков</div>
            </div>
          </div>
          <div class="params__item params__item-blanks">
            <div class="params__item-title">
              Список дефектов
            </div>
            <div class="defects-wrapper">
              <div class="defects">
                <div>
                  <button class="btn" type="info" width="100%" @click="load1">
                    Загрузить
                  </button>
                  <input
                    id="downloadData"
                    ref="file1"
                    type="file"
                    hidden
                    @input="loadData1"
                  />
                </div>
                <div class="defects-paper-add params__item-title">
                  Добавить лист № {{ countDefectsPaper + 1 }}
                  <button
                    class="btn"
                    @click="
                      countDefectsPaper = countDefectsPaper + 1;
                      defectsList.push([]);
                    "
                  >
                    +
                  </button>
                </div>
                <div v-if="countDefectsPaper" class="params__item-title">
                  Добавить дефект для листа № {{ countDefectsPaper }}
                  <div class="defects-list">
                    <div class="defects-add-field">
                      <label class="params-field-label" for="defectx-input"
                        >x</label
                      >
                      <input
                        v-model="defectParamsInput.x"
                        min="0"
                        type="number"
                        name="defectx-input"
                        class="default-input"
                      />
                    </div>
                    <div class="defects-add-field">
                      <label class="params-field-label" for="defecty-input"
                        >y</label
                      >
                      <input
                        v-model="defectParamsInput.y"
                        min="0"
                        type="number"
                        name="defecty-input"
                        class="default-input"
                      />
                    </div>
                    <div class="defects-add-field">
                      <label class="params-field-label" for="defectw-input"
                        >Ширина</label
                      >
                      <input
                        v-model="defectParamsInput.width"
                        min="0"
                        type="number"
                        name="defectw-input"
                        class="default-input"
                      />
                    </div>
                    <div class="defects-add-field">
                      <label class="params-field-label" for="defecth-input"
                        >Высота</label
                      >
                      <input
                        v-model="defectParamsInput.height"
                        min="0"
                        type="number"
                        name="defecth-input"
                        class="default-input"
                      />
                    </div>
                    <div class="params-item-blanks-add-field-btn">
                      <button class="btn" @click="addToDefectList">+</button>
                    </div>
                  </div>
                </div>
                <div
                  v-for="(paper, key3) in defectsList"
                  :key="key3"
                  class="params__item-table"
                >
                  <table
                    v-if="defectsList[key3] && defectsList[key3].length"
                    class="blanks__table"
                  >
                    <caption>
                      Список дефектов листа
                      {{
                        key3 + 1
                      }}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">лист</th>
                        <th scope="col">Ширина</th>
                        <th scope="col">Высота</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(defect, key4) in defectsList[key3]"
                        :key="key4"
                      >
                        <td>{{ defect.paper }}</td>
                        <td>{{ defect.width }}</td>
                        <td>{{ defect.height }}</td>
                        <td>
                          <button
                            class="btn"
                            @click="deleteDefect(defect, key3)"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <!-- <button
            :disabled="!isNotAllFieldsFilled"
            class="params-btn"
            @click="countScale"
          > -->
          <!-- построить
          </button> -->
          <!-- <button @click="addCanvas">
            Добавить
          </button> -->
          <button
            class="btn"
            :disabled="!isNotAllFieldsFilled"
            @click="algorithmStart"
          >
            Запустить алгоритм
          </button>
        </template>
        <template v-else-if="currentTab === TABS.cutting && isShowCutting">
          <div class="params__blank-list-wrapper">
            <ul>
              <li
                :class="{ 'params__blank-list-item_active': showPaper === 0 }"
                @click="drawBestSolution(0)"
              >
                Все
              </li>
              <li
                v-for="(cutIndex, key1) in bestSolutionValue"
                :key="key1"
                :class="{
                  'params__blank-list-item_active': showPaper === key1 + 1
                }"
                @click="drawPaper(key1 + 1)"
              >
                {{ key1 + 1 }} карта
              </li>
            </ul>
          </div>
          <div v-if="Number(showPaper) != 0">
            <template v-if="descriptionPaper">
              <div v-if="descriptionPaper.fullness">
                Заполненность {{ descriptionPaper.fullness }}
              </div>
              <div>
                <table
                  v-if="
                    descriptionPaper.blanks && descriptionPaper.blanks.length
                  "
                  class="blanks__table"
                >
                  <caption>
                    Список деталей
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">№</th>
                      <th scope="col">Ширина</th>
                      <th scope="col">Высота</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(blank, key2) in descriptionPaper.blanks"
                      :key="key2"
                    >
                      <td>{{ blank.id + 1 }}</td>
                      <td>{{ blankById(blank.id).width }}</td>
                      <td>{{ blankById(blank.id).height }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
          <div>
            <button class="btn" @click="printMaps">Распечатать</button>
          </div>
        </template>
      </div>
      <div v-if="isLoaded" class="params__loaded">
        <div>{{ isLoaded }}</div>
      </div>
      <div class="canvas__wrapper">
        <!-- <div class="cutting-chart__canvas-wrapper">
          <canvas id="myCanvas0" ref="canvas0" class="cutting-chart__canvas">
          </canvas>
        </div> -->
        <!-- <div id="myCanvas1" class="cutting-chart__canvas-wrapper">
              <canvas ref="canvas1" id="myCanvas1" class="cutting-chart__canvas">
              </canvas>
          </div> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./cutting-chart.ts"></script>
<style src="./cutting-chart.css"></style>
