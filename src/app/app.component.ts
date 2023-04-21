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
          // trigger: ['#1/#2'],
          //@ts-ignore
          parse: (parser) => {
            return [
              'smallfrac',
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
              parser.matchRequiredLatexArgument() ?? ['Error', "'missing'"],
            ];
          },
        },
      ],
    });
    
    // Set the Compute Engine for all mathfields
    MathfieldElement.computeEngine = ce;
    
    this.mfe.macros = {
      ...this.mfe.getOptions('macros'),
      'smallfrac': {
        args: 2,
        // def: '{}^{#1}\\!\\!/\\!{}_{#2}'
        def: '#1/#2'
      },
    };
    this.mfe.inlineShortcuts = {
      ...this.mfe.getOptions('inlineShortcuts'),
      // node: '{#1}_{\\left\\lbrack#2\\right\\rbrack}^{#3}({#4})'
      // node:'\\mathrm{smallfrac}({#1},{#2})'
      node: '\\smallfrac{#@}{#?}'
    };
    
    let ent = '';
    let ent2 = '';

    let doc = document.getElementById(`global-expression-math-field`)

    mfe.addEventListener('input', (e: any) => {

      ent = e.target.getValue('latex-expanded')

      ent2 = e.target.getValue('math-json')


      console.log('latex: ', ent);

      console.log('mathjson: ', ent2);

    })

    doc?.appendChild(this.mfe)


  }
}
