import React, { useState, useEffect } from 'react';
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

const TodoList = () => {
  const [todoItems, setTodoItems] = useState(items);
  const [fruitItems, setFruitItems] = useState([]);
  const [vegetableItems, setVegetableItems] = useState([]);

    useEffect(() => {
    const timeoutIds = [];
    const handleTimeouts = (items, setter) => {
      items.forEach((item, index) => {
        const timeoutId = setTimeout(() => {
          setter((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
          setTodoItems((prevItems) => [...prevItems, item]);
        }, 5000 * (index + 1)); 
        timeoutIds.push(timeoutId);
      });
    };
    handleTimeouts(fruitItems, setFruitItems);
    handleTimeouts(vegetableItems, setVegetableItems);
    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [fruitItems, vegetableItems]);
  
  //ฟังก์ชันให้รายการย้ายไปยังคอลัมย่อย (Fruit หรือ Vegetable) กลับมายังคอลัมหลัก (Todo) หลังจากผ่านไป 5 วินาที
  const moveItem = (item) => {
    const newItem = { ...item };
    if (newItem.type === 'Fruit') {
      setFruitItems((prevItems) => [...prevItems, newItem]);
    } else if (newItem.type === 'Vegetable') {
      setVegetableItems((prevItems) => [...prevItems, newItem]);
    }
    setTodoItems((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
    setTimeout(() => {
      setTodoItems((prevItems) => [...prevItems, newItem]);
      if (newItem.type === 'Fruit') {
        setFruitItems((prevItems) => prevItems.filter((prevItem) => prevItem !== newItem));
      } else if (newItem.type === 'Vegetable') {
        setVegetableItems((prevItems) => prevItems.filter((prevItem) => prevItem !== newItem));
      }
    }, 5000);
  };
  
  //ช้สำหรับย้ายรายการกลับไปยังคอลัมหลัก (Todo) จากคอลัมย่อย (Fruit หรือ Vegetable) 
  //โดยตรวจสอบก่อนว่ารายการนั้นๆ ยังไม่มีในรายการหลักแล้วก่อนหรือไม่
  const moveBack = (item, columnType) => {
    const newItem = { ...item };
    const isItemInTodo = todoItems.some(todoItem => 
      todoItem.type === newItem.type && todoItem.name === newItem.name
    );
    if (!isItemInTodo) {
      setTodoItems(prevItems => [...prevItems, newItem]);
    }
    if (columnType === 'fruitColumn') {
      setFruitItems(prevItems => prevItems.filter(prevItem => prevItem !== item));
    } else if (columnType === 'vegetableColumn') {
      setVegetableItems(prevItems => prevItems.filter(prevItem => prevItem !== item));
    }
  };
  
  return (
    <div className="container">
      <div className="column" id="todoColumn">
        {todoItems.map((item, index) => (
          <button className="button" key={index} id={item.name} name={item.name} onClick={() => moveItem(item)}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="column" style={{ border: '1px solid #ccc' }} id="fruitColumn">
        <div className="card" style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <h1 style={{ margin: '1px' }}>Fruit</h1>
        </div>
        {fruitItems.map((item, index) => (
          <button className="button" key={index} id={item.name} name={item.name} onClick={() => moveBack(item, 'fruitColumn')}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="column" style={{ border: '1px solid #ccc' }} id="vegetableColumn">
        <div className="card" style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <h1 style={{ margin: '1px' }}>Vegetable</h1>
        </div>
        {vegetableItems.map((item, index) => (
          <button className="button" key={index} id={item.name} name={item.name} onClick={() => moveBack(item, 'vegetableColumn')}>
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
