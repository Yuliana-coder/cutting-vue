import { Component, Vue } from "vue-property-decorator";

@Component
export default class Homepage extends Vue {
  isShowBlock: any = {
    description: false,
    instruction: false,
    theory: false
  };
}
