import { Component, h, Element, Prop } from "@stencil/core";
import "ionicons";

@Component({
  tag: "ae-morph-component",
  styleUrl: "ae-morph-component.css",
  shadow: true
})
export class AeMorphComponent {

  @Element() el: HTMLElement;

  @Prop() aetype: string
  @Prop() aesize: string;
  @Prop() name: string;
  @Prop() color: string;
  @Prop() arialabel: string;

  constructor() {
    this.iconClicked = this.iconClicked.bind(this);
  }

  /**
   * The component is about to load and has not rendered yet.
   * This is the best place to make any data updates
   * before the first render.
   * componentWillLoad will only be called once.
   */
  componentWillLoad() {
    //console.log('Component ae-icons-component is about to be rendered');
    //console.log('aesize=' + this.aesize + ' name=' + this.name + ' color=' + this.color)
    //console.log(this.el.shadowRoot);
    //console.log('aetype=' + this.aetype);
  }

  iconClicked(evt) {
    console.log(evt.currentTarget);
    console.log(this.arialabel);
    if (this.arialabel) {
      switch (this.arialabel) {
        case "ae-remove-circle": {
          document.getElementById("containerPara").innerHTML = this.arialabel;
          this.aesize = "ae16";
          console.log(this.arialabel + " ae16");
          break;
        }
        case "ae-add-circle": {
          document.getElementById("containerPara").innerHTML = this.arialabel;
          this.aesize = "ae64";
          console.log(this.arialabel + " ae64");
          break;
        }
        case "ae-refresh-circle": {
          document.getElementById("containerPara").innerHTML = this.arialabel;
          this.aesize = "ae96";
          console.log(this.arialabel + " ae64");
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    } else {
      document.getElementById("containerPara").innerHTML = "<br>" + this.name
    }
  }

  render() {
    return (
      <ion-icon class={this.aesize} name={this.name} color={this.color} onClick={this.iconClicked}></ion-icon>
    );
  }
}

