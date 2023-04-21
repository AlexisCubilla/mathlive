// import { Component } from '@angular/core';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ComputeEngine } from '@cortex-js/compute-engine'

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
    this.mfe = new MathfieldElement();
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
          trigger: ['\\node'],
          //@ts-ignore
          parse: (parser) => {
            return [
              'node',
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"]
            ];
          },
        },
        {
          trigger: ['\\set'],
          //@ts-ignore
          parse: (parser) => {
            return [
              'set',
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"]
            ];
          },
        }
      ],
    });
    
    // Set the Compute Engine for all mathfields
    MathfieldElement.computeEngine = ce;
    
    this.mfe.macros = {
      ...this.mfe.getOptions('macros'),
      'smallfrac': {
        args: 2,
        def: '{}^{#1}\\!\\!/\\!{}_{#2}',
        // def: '{#@}/{#?}',
        captureSelection: false,
      },
      'node':{
        args:4,
        def: '{#1}_{\\left\\lbrack#2\\right\\rbrack}^{#3}({#4})',
        captureSelection: false,

      },
      'set':{
        args:5,
        def: '{#1}_{\\left\\lbrack#2\\right\\rbrack}^{#3}({#4})={#5}',
        captureSelection: false
      }
    };
    this.mfe.inlineShortcuts = {
      ...this.mfe.getOptions('inlineShortcuts'),
      // node: '{#1}_{\\left\\lbrack#2\\right\\rbrack}^{#3}({#4})'
      // node:'\\mathrm{smallfrac}({#1},{#2})'
      smallfrac: '\\smallfrac{#@}{#?}',
      // node: '\\node{#1}{#2}{#3}{#4}',
      // node: '\\node{#1}_\\left\\lbrack{#2}\\right\\rbrack^{#3}{#4}'
      node: '\\node{#1}{#2}{#3}{#4}',
      set:'\\set{#1}{#2}{#3}{#4}{#5}'
    };
    
    let ent = '';
    let ent2 = '';

    let doc = document.getElementById(`global-expression-math-field`)

    this.mfe.addEventListener('input', (e: any) => {

      ent = e.target.getValue('latex-expanded')

      ent2 = e.target.getValue('math-json')


      console.log('latex: ', ent);

      console.log('mathjson: ', ent2);

    })

    doc?.appendChild(this.mfe)


  }
}
