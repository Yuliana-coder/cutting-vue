<template>
  <div class="cutting-chart">
    <div class="cutting-chart-main">
      <div class="cutting-chart__params-wrapper">
        <div class="params__item">
          <button
            :disabled="currentTab === TABS.params"
            @click="currentTab = TABS.params"
          >
            Параметры раскроя
          </button>
          <button
            :disabled="currentTab === TABS.cutting || !isShowCutting"
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
                @change="loadData"
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
                  <tr v-for="(blank, key) in blanksList" :key="key">
                    <td>{{ blank.id }}</td>
                    <td>{{ blank.width }}</td>
                    <td>{{ blank.height }}</td>
                    <td>
                      <button @click="deleteBlank(blank.id)">
                        Удалить {{ blank.id }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
          <button :disabled="!isNotAllFieldsFilled" @click="algorithmWork">
            Запустить алгоритм
          </button>
        </template>
        <template v-else-if="currentTab === TABS.cutting && isShowCutting">
          Раскрой
          <!-- <ul>
              <li @click="currentPaper = cutIndex" v-for="(cutIndex, key1) in blanksCount" :key="key1">
                {{cutIndex}} карта
              </li>
            </ul> -->
        </template>
      </div>
      <div class="canvas__wrapper">
        {{ isLoaded }}
        <div v-if="isLoaded">
          Алгоритм выполняется...
        </div>
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
