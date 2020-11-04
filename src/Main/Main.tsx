import React, { useState, ReactComponentElement } from 'react';
import style from './Main.module.sass';

/*labs*/
import { Lab1 } from "../Lab-1/Lab1";

const labs: Map<number, ReactComponentElement<'div'>> = new Map([
    [1, <Lab1 />]
])
const labNames = Array(7).fill(0).map((v, index) => `Лабораторная №${index + 1}`)

function Main() {
  const [currentLab, changeLab] = useState<null | number>(null)

  return (
    <div className={style.main}>
      <div className={style.labs}>
          {
              labNames.map((name, index) => (
                  <div
                      key={index}
                      className={style.labNameItem}
                      onClick={() => changeLab(index + 1)}
                  >
                      {name}
                  </div>
              ))
          }
      </div>
      <div className={style.labItem}>
          {currentLab && labs.get(currentLab)}
      </div>
    </div>
  );
}

export default Main;
