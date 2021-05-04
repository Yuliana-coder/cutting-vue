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
                <label class="params-field-label" for="width-input">Ширина</label>
                <input min="0" type="number" v-model="paperParamsInput.width" name="width-input" class="default-input" />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="height-input">Высота</label>
                <input min="0" type="number" v-model="paperParamsInput.height" name="height-input" class="default-input" />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="allowance-input">Припуск на окантовку</label>
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
                <label class="params-field-label" for="countBlanks-input">Количество заготовок</label>
                <input v-model="blanksCount" min="0" type="number" name="countBlanks-input" class="default-input" />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="cut-input">Припуск на рез</label>
                <input min="0" type="number" name="cut-input" class="default-input" />
              </div>
              <div class="params-field">
                <label class="params-field-label" for="blankBordero-input">Припуск на обработку заготовки</label>
                <input min="0" type="number" name="blankBordero-input" class="default-input" />
              </div>
              <div class="params-field params-field_btn-wrapper">
                <button :disabled="blanksCount=== '0'" class="params-field-btn">Задать размеры заготовок</button>
              </div>
            </div>
          </div>
          <div class="params__item-table">
            <table>
              <caption>A summary of the UK's most famous punk bands</caption>
              <thead>
                <tr>
                  <th scope="col">Band</th>
                  <th scope="col">Year formed</th>
                  <th scope="col">No. of Albums</th>
                  <th scope="col">Most famous song</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Buzzcocks</th>
                  <td>1976</td>
                  <td>9</td>
                  <td>Ever fallen in love (with someone you shouldn't've)</td>
                </tr>
                <tr>
                  <th scope="row">The Clash</th>
                  <td>1976</td>
                  <td>6</td>
                  <td>London Calling</td>
                </tr>

                  ... some rows removed for brevity

                <tr>
                  <th scope="row">The Stranglers</th>
                  <td>1974</td>
                  <td>17</td>
                  <td>No More Heroes</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colspan="2">Total albums</th>
                  <td colspan="2">77</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <button class="params-btn" @click="countScale">
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