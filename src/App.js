import React, { useState, useEffect, useRef } from 'react';
import './App.css';

//ระบุ type แหละ name ในการสร้างปุ่ม
const items = [
  { type: 'Fruit', name: 'Apple' },
  { type: 'Vegetable', name: 'Broccoli' },
  { type: 'Vegetable', name: 'Mushroom' },
  { type: 'Fruit', name: 'Banana' },
  { type: 'Vegetable', name: 'Tomato' },
  { type: 'Fruit', name: 'Orange' },
  { type: 'Fruit', name: 'Mango' },
  { type: 'Fruit', name: 'Pineapple' },
  { type: 'Vegetable', name: 'Cucumber' },
  { type: 'Fruit', name: 'Watermelon' },
  { type: 'Vegetable', name: 'Carrot' }
];

//ประกาศฟังก์ชัน TodoList ภายในนี้จะมีการใช้ useState เพื่อเก็บสถานะของรายการที่ต้องทำ (todoItems), 
//รายการผลไม้ (fruitItems), และรายการผัก (vegetableItems) โดยเริ่มต้นทั้งสามกับรายการที่กำหนดใน items
const TodoList = () => {
  const [todoItems, setTodoItems] = useState(items);
  const [fruitItems, setFruitItems] = useState([]);
  const [vegetableItems, setVegetableItems] = useState([]);
  const timeoutRefs = useRef({});

//ใช้ useEffect เพื่อทำความสะอาด timeout ทุกครั้งที่คอมโพเนนต์ถูก unmount ออกจาก DOM เพื่อป้องกันการรั่วความจำ
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);

//ประกาศฟังก์ชัน moveItem ที่ใช้ในการเลือกรายการที่ต้องทำและย้ายไปยังรายการผลไม้หรือรายการผัก 
//โดยใช้ setTimeout เพื่อกำหนดเวลาในการย้าย และใช้ useRef เพื่อเก็บการอ้างอิงไปยัง timeout แต่ละตัวเพื่อให้สามารถยกเลิกได้
  const moveItem = (item, timeout) => {
    const newItem = { ...item };
    if (newItem.type === 'Fruit') {
      setFruitItems((prevItems) => [...prevItems, newItem]);
    } else if (newItem.type === 'Vegetable') {
      setVegetableItems((prevItems) => [...prevItems, newItem]);
    }
    setTodoItems((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
    const timeoutId = setTimeout(() => {
      if (!fruitItems.includes(newItem) && !vegetableItems.includes(newItem)) {
        setTodoItems((prevItems) => [...prevItems, newItem]);
      }
      if (newItem.type === 'Fruit') {
        setFruitItems((prevItems) => prevItems.filter((prevItem) => prevItem !== newItem));
      } else if (newItem.type === 'Vegetable') {
        setVegetableItems((prevItems) => prevItems.filter((prevItem) => prevItem !== newItem));
      }
      timeoutRefs.current[item.name] = undefined;
    }, timeout);
    timeoutRefs.current[item.name] = timeoutId;
  };

//ประกาศฟังก์ชัน moveBack ที่ใช้ในการย้ายรายการกลับไปยังรายการที่ต้องทำ โดยยกเลิก timeout ถ้ามีการเรียกใช้ฟังก์ชันนี้
  const moveBack = (item, columnType) => {
    const newItem = { ...item };
    const isItemInTodo = todoItems.some((todoItem) => todoItem.type === newItem.type && todoItem.name === newItem.name);
    if (!isItemInTodo) {
      setTodoItems((prevItems) => [...prevItems, newItem]);
    }
    if (columnType === 'fruitColumn') {
      setFruitItems((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
    } else if (columnType === 'vegetableColumn') {
      setVegetableItems((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
    }
    const timeoutId = timeoutRefs.current[item.name];
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current[item.name] = undefined;
    }
  };

  return (
    <div className="container">
      <div className="column" id="todoColumn">
        {todoItems.map((item, index) => (
          <button className="button" key={index} onClick={() => moveItem(item, 5000)}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="column" style={{ border: '1px solid #ccc' }} id="fruitColumn">
        <div className="card" style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <h1 style={{ margin: '1px' }}>Fruit</h1>
        </div>
        {fruitItems.map((item, index) => (
          <button className="button" key={index} onClick={() => moveBack(item, 'fruitColumn')}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="column" style={{ border: '1px solid #ccc' }} id="vegetableColumn">
        <div className="card" style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <h1 style={{ margin: '1px' }}>Vegetable</h1>
        </div>
        {vegetableItems.map((item, index) => (
          <button className="button" key={index} onClick={() => moveBack(item, 'vegetableColumn')}>
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
