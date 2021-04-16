<template>
  <div class="cutting-chart">
      <div class="cutting-chart-main">
        <div class="cutting-chart__params-wrapper">
          <div class="cutting-chart__params__item">
            <div class="cutting-chart__params__item-label">
              Введите размеры одного листа материала {{paperParams}} {{scaleFactor}} {{1200 / paperParamsInput.width}}
            </div>
            <div class="cutting-chart__params__item-input-wrapper">
              <div class="cutting-chart__params-field">
                <label for="width-input">Ширина</label><input v-model="paperParamsInput.width" name="width-input" class="default-input" />
              </div>
              <div class="cutting-chart__params-field">
                <label for="height-input">Высота</label><input v-model="paperParamsInput.height" name="height-input" class="default-input" />
              </div>
              <div class="cutting-chart__params-field">
                <label for="allowance-input">Припуск на окантовку</label><input v-model="paperParamsInput.allowanceBorder" name="allowance-input" class="default-input" />
              </div>
            </div>
        </div>
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