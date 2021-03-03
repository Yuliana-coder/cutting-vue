import { Vue, Component } from "vue-property-decorator";

@Component
export default class CuttingChart extends Vue {
 
    mounted() {
        console.log('KKKKKKKKKKKKKKKKK'
        ,this, this.$refs, this.$refs.canvas);
        
        let canvas = <HTMLCanvasElement> this.$refs.canvas;
        let context = canvas.getContext("2d");
        if(context) {    
            context.strokeRect(0, 0, 50, 50);
            context.strokeRect(55, 0, 50, 50);
            context.fillText("Hello", 5, 15);
        }
    }
}
