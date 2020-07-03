import React, { useState } from "react";
import { action } from "@storybook/addon-actions";
import DragSelect from "../DragSelect";
import './table.scss'

const WEEK_S = ["一", "二", "三", "四", "五", "六", "日"];

export default {
  title: "DragSelect",
  component: DragSelect
};

export const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cells, setCells] = useState(initCellsFunc());
  const changeDrag = (val: React.SetStateAction<any[]>) => {
    action('draged!')
    setCells(val)
  };

  return (
    <DragSelect value={cells} onChange={changeDrag}>
      <tr>
        <td disabled>星期/时段</td>
        {Array(24)
          .fill(null)
          .map((item, index) => (
            <td disabled key={index}>{`${index}-${index + 1}`}</td>
          ))}
      </tr>
      {Array(7)
        .fill(null)
        .map((item, index) => {
          return (
            <tr key={`${index}__TR`}>
              <td disabled>{WEEK_S[index]}</td>
              {Array(24)
                .fill(null)
                .map((ele, idx) => (
                  <td key={idx} />
                ))}
            </tr>
          );
        })}
    </DragSelect>
  );
};

// helpers
const initCellsFunc = () => {
  let arr = new Array(8); // 25rows
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(25).fill(true);
  }
  return arr;
};
