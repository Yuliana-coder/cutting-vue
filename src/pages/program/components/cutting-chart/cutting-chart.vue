<template>
  <div class="cutting-chart">
      <div class="cutting-chart-main">
        <div class="cutting-chart__params-wrapper">
          <div class="params__item">
            <div class="params__item-title">
              Введите размеры одного листа материала
            </div>
            <div class="params__item-input-wrapper">
              <div class="params-field">
                <label class="params-field-label" for="width-input">Ширина, мм</label>
                <input min="0" type="number" v-model="paperParamsInput.width" name="width-input" class="default-input" />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="height-input">Высота, мм</label>
                <input min="0" type="number" v-model="paperParamsInput.height" name="height-input" class="default-input" />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="allowance-input">Припуск на окантовку, мм</label>
                <input min="0" type="number" v-model="paperParamsInput.allowanceBorder" name="allowance-input" class="default-input" />
              </div>
            </div>
          </div>
          <div class="params__item">
            <div class="params__item-title">
              Введите параметры заготовок
            </div>
            <div class="params__item-input-wrapper">
              <div class="params-field">
                <label class="params-field-label" for="cut-input">Припуск на рез, мм</label>
                <input v-model="allowanceBlank.cut" min="0" type="number" name="cut-input" class="default-input" />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="blankBorder-input">Припуск на обработку заготовки, мм</label>
                <input v-model="allowanceBlank.blankBorder" min="0" type="number" name="blankBorder-input" class="default-input" />
              </div>
              <!-- <div class="params-field params-field_btn-wrapper">
                <button :disabled="blanksCount=== '0'" class="params-field-btn">Задать размеры заготовок</button>
              </div> -->
            </div>
          </div>
          <div class="params__item params__item-blanks">
            <div class="params__item-blanks-add-wrapper">
              <div class="params-item-blanks-add-field">
                <label class="params-field-label" for="cut-input">Ширина, мм</label>
                <input v-model="blankParamsInput.width" min="0" type="number" name="cut-input" class="default-input" />
              </div>
              <div class="params-item-blanks-add-field">
                <label class="params-field-label" for="blankBordero-input">Высота, мм</label>
                <input v-model="blankParamsInput.height" min="0" type="number" name="blankBordero-input" class="default-input" />
              </div>
              <div class="params-item-blanks-add-field params-item-blanks-add-field-btn">
                <button :disabled="!(blankParamsInput.width && blankParamsInput.height)" @click="addToBlanksList">+</button>
              </div>
            </div>
            <div class="params__item-table">
              <table class="blanks__table" v-if="blanksList && blanksList.length">
                <caption>Список деталей</caption>
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
                    <td>{{key + 1}}</td>
                    <td>{{blank.width}}</td>
                    <td>{{blank.height}}</td>
                    <td><button @click="deleteBlank(blank.id)">Удалить {{blank.id}}</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button :disabled="!isNotAllFieldsFilled" class="params-btn" @click="countScale">
            построить
          </button>
        </div>
        <div id="myCanvas" class="cutting-chart__canvas-wrapper">
            <canvas ref="canvas" id="myCanvas" class="cutting-chart__canvas">
            </canvas>
        </div>
      </div>
  </div>
</template>
<script lang="ts" src="./cutting-chart.ts"></script>
<style src="./cutting-chart.css"></style>