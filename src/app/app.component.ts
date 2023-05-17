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

        {
          name: "node",
          serialize: (serializer, expr: any) => {

            for (let i = 1; i <= 4; i++) {

              expr[i] = serializer.serialize(expr[i])
              
              if (expr[i] === "\\mathrm{Nothing}") {
                expr[i] = "\\placeholder{}";
              }
            }
            return `\\node{${expr[1]}}_{\\left\\lbrack{${expr[2]}}\\right\\rbrack}^{${expr[3]}}({${expr[4].replace(/(\w+)\((.*?)\)/g, '$1,$2').replace(/,+$/, '')}})`
          },

        },
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
            const arg1 = parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"];

            parser.skipSpace();

            let sub = ['Error', "'missing'"];
            if (parser.matchAll(['_', '<{>', '\\left', '\\lbrack'])) {
              parser.addBoundary(['\\right', '\\rbrack', '<}>']);
              parser.skipSpace();
              sub = parser.matchExpression();
              sub[0] === "Sequence" ? sub[0] = 'List' : sub[0]
              console.log('sub------', sub)
              parser.skipSpace();
              if (!parser.matchBoundary()) return parser.boundaryError('expected-closing-delimiter');
            }

            let sup = ['Error', "'missing'"];
            if (parser.match('^')) {
              parser.skipSpace();
              sup = parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"];
            }

            parser.skipSpace();

            // The "implicit" parameter indicate that we expect either 
            // a parentheses (or other grouping), or an implicit argument
            // i.e. a simple operation, like for trig functions
            const arg2 = parser.matchArguments('implicit')[0];

            return ['node', arg1, sub, sup, arg2]
          }
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
      }
    };
    this.mfe.inlineShortcuts = {
      ...this.mfe.getOptions('inlineShortcuts'),
      // smallfrac: '\\smallfrac{#@}{#?}',
      // set: "\\set{#@}_\\left\\lbrack{#?}\\right\\rbrack^{#?}{#?}={#?}",
      // get: "\\get{#@}_\\left\\lbrack{#?}\\right\\rbrack^{#?}{#?}",
      node: "\\node{#@}_\\left\\lbrack{#?}\\right\\rbrack^{#?}({#?})",
      test: "\\test_{#1}^{#2}",

    };

    ce.jsonSerializationOptions

    let ent = '';
    let ent2 = '';

    let doc = document.getElementById(`global-expression-math-field`);

    let latex = document.querySelector('#latex');

    let mathjson = document.querySelector('#math-json');

    let latexjson = document.querySelector('#latex-json');


    this.mfe.addEventListener('input', (e: any) => {

      latex!.textContent = this.mfe.getValue('latex-expanded');

      mathjson!.textContent = this.mfe.getValue('math-json');

      //@ts-ignore
      // latexjson!.textContent = ce.serialize(JSON.parse(mathjson!.textContent));

      latexjson!.textContent = MathfieldElement.computeEngine.serialize(JSON.parse(mathjson!.textContent))

      console.log('latex: ', latex!.textContent);

      console.log('mathjson: ', mathjson!.textContent);

      console.log('mfe: ', this.mfe);

    })

    doc?.appendChild(this.mfe)

    console.log(this.mfe)


  }
}
