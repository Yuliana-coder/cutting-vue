<template>
  <div class="cutting-chart">
      <div class="cutting-chart_settings-wrapper">
          <div class="cutting-chart_settings">
              <button>
                  Загрузить данные
              </button>
              <button>
                  Сохранить результаты
              </button>
              <button>
                  Справка
              </button>
          </div>
      </div>
      <div class="cutting-chart-main">
        <div class="cutting-chart__params-wrapper">Params</div>
        <div id="myCanvas" class="cutting-chart__canvas-wrapper">
            <canvas ref="canvas" id="myCanvas" class="cutting-chart__canvas">
            </canvas>
        </div>
      </div>
  </div>
</template>
<script lang="ts" src="./cutting-chart.ts"></script>
<style src="./cutting-chart.css"></style>