// import { Component } from '@angular/core';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ComputeEngine } from '@cortex-js/compute-engine';



declare const MathfieldElement: any;

// import { MathfieldElement } from 'mathlive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'mathlive';
  ce2: any

  mfe: any
  constructor(

  ) {
    // this.mfe = new MathfieldElement();
  }

  ngAfterViewInit(): void {
    const ce = new ComputeEngine({
      latexDictionary: [
        //@ts-ignore
        ...ComputeEngine.getLatexDictionary(),
        {
          trigger: ['\\smallfrac'],
          //@ts-ignore
          parse: (parser) => {
            return [
              'smallfrac',
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
            ];
          },
        },
        {
          trigger: ['\\set'],
          //@ts-ignore
          parse: (parser) => {
            let a = '';
            return [
              'set',
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"]
            ];
          },
        },
        {
          trigger: ['\\get'],
          //@ts-ignore
          parse: (parser) => {
            let a = '';
            return [
              'get',
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"]
            ];
          },
        },
        {
          trigger: ['\\node'],
          //@ts-ignore
          parse: (parser) => {
            let a = '';
            return [
              'node',
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"]
            ];
          },
        },
        {
          trigger: ['\\test'],
          //@ts-ignore
          parse: (parser) => {

            let a = '';
            return [
              'test',
              // parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              // parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"]
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"],
              (a = parser.matchRequiredLatexArgument()) ? (['^', '_', '='].includes(a) ? parser.matchRequiredLatexArgument() : a) : ['Error', "'missing'"]
            ];
          },
        }
      ],

    });

    console.log(ce)

    // Set the Compute Engine for all mathfields
    MathfieldElement.computeEngine = ce;

    this.mfe = new MathfieldElement();

    this.mfe.macros = {
      ...this.mfe.getOptions('macros'),
      'smallfrac': {
        args: 2,
        def: '{}^{#1}\\!\\!/\\!{}_{#2}',
        // def: '{#@}/{#?}',
        captureSelection: false,
      },
      // 'node': {
      //   args: 4,
      //   def: "\\node{#@}_\\left\\lbrack{#?}\\right\\rbrack^{#?}{#?}",
      //   captureSelection: false,
      // }


      // 'node': {
      //   args: 4,
      //   def: '{#1}_{\\left\\lbrack#2\\right\\rbrack}^{#3}({#4})',
      //   captureSelection: false,

      // },
      // 'set': {
      //   args: 5,
      //   def: '{#1}_{\\left\\lbrack#3\\right\\rbrack}^{#2}({#4})={#5}',
      //   captureSelection: false
      // },
      // 'get': {
      //   args: 4,
      //   def: '{#1}_{\\left\\lbrack#3\\right\\rbrack}^{#2}({#4})',
      //   captureSelection: false
      // }
    };
    this.mfe.inlineShortcuts = {
      ...this.mfe.getOptions('inlineShortcuts'),
      smallfrac: '\\smallfrac{#@}{#?}',
      set: "\\set{#@}_\\left\\lbrack{#?}\\right\\rbrack^{#?}{#?}={#?}",
      get: "\\get{#@}_\\left\\lbrack{#?}\\right\\rbrack^{#?}{#?}",
      node: "\\node{#@}_\\left\\lbrack{#?}\\right\\rbrack^{#?}{#?}",
      test: "\\test_{#1}^{#2}",

    };

    let ent = '';
    let ent2 = '';

    let doc = document.getElementById(`global-expression-math-field`);

    let latex = document.querySelector('#latex');

    let mathjson = document.querySelector('#math-json');


    this.mfe.addEventListener('input', (e: any) => {

      ent = e.target.getValue('latex-expanded')
      latex!.textContent = this.mfe.getValue('latex-expanded');

      mathjson!.textContent = this.mfe.getValue('math-json');

      ent2 = e.target.getValue('math-json')

      console.log('latex: ', latex!.textContent);

      console.log('mathjson: ', mathjson!.textContent);

    })

    // this.mfe.defineFunction(["nide"], "", {
    //   ifMode: "math",

    //   createAtom: (command: any, context: any, style: any) => new  this.mfe.OperatorAtom(command, "", context, {
    //     isExtensibleSymbol: true,
    //     style,
    //     isFunction: true,
    //     limits: "adjacent"
    //   })
    // });


    doc?.appendChild(this.mfe)

    console.log(this.mfe)


  }
}
