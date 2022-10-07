import './App.css';
import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue, MotionValue, useTransform, PanInfo } from "framer-motion";

interface list{
  name: string,
  link: string
}

type recipe = {
  strMeal: string,
  strSource: string,
  strMealThumb: string
}

export default function App() {
  const [recipeImg, setRecipeImg] = useState<recipe>({} as recipe);
  const [click, setClick] = useState(0);
  const [recipeList, setRecipeList] = useState<Array<list>>([]);
  const [animation, setAnimation] = useState<boolean>(false)
  const [a, setA] = useState<boolean>(false);

  // const storeData = (value) => {
  //   const jsonValue = JSON.stringify(value)
  //   localStorage.setItem('recipes', jsonValue);
  // }

  // const getMyObject = () => {
  //   const jsonValue = localStorage.getItem('recipes')
  //   jsonValue != null ? JSON.parse(jsonValue) : null
  // }

  const x: MotionValue<number> = useMotionValue(0)

  const variants = {
    exitRight: { x: [0, 200, 0], transition: { duration: 0.2 } },
    exitLeft: {x: [0, -200, 0], transition: { duration: 0.2 }},
    exit: {}
  };

  const onClickYes = () => {
    setA(true);
    setClick(click +1);
    setAnimation(true);
    setRecipeList([...recipeList, {name: recipeImg.strMeal, link: recipeImg.strSource}]);
    setTimeout(() => {
      setAnimation(false);
    }, 500);
  };

  const onClickNo = () => {
    setA(true);
    setClick(click -1);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.point.x < 700 && info.point.x > 200) {
      return 
    }
    else {
      if (info.point.x > 700){
        onClickYes();
      } else if (info.point.x < 200){
        setClick(click - 1)
      }
      else {
      return
      }
    }
    console.log(info.offset.x)
  }

  const animationToggle = () => {
    if (a === true) {
      if (animation === true) {
        return 'exitRight'
      }
      else {
        return 'exit'
      }
    }
    else {
      if (animation === true) {
        return 'exitLeft'
      }
      else {
        return 'exit'
      }
    }
  }

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then((response) => response.json())
    .then((data) => setRecipeImg(data.meals[0]));
  }, [click]);

  return (
    <div className='app'>
      <div className='frame'>
        <div>Would you eat this?!</div>
          <motion.img className='card'
            // Card can be drag only on x-axis
            // variants={variants}
            // animate={animationToggle()}
            drag="x"
            x={x}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
            dragSnapToOrigin={true}
            dragConstraints={{ left: -100, right: 100 }}
            onDragEnd={handleDragEnd}
            src={recipeImg.strMealThumb} 
            alt="recipe img" 
            style={{width: 400, height: 400}} 
            />
        <div className='button-style'>
          <button style={{backgroundColor: "red", width: 50, height: 50}} onClick={onClickNo} />
          <button style={{backgroundColor: "green", width: 50, height: 50}} onClick={onClickYes}/>
        </div>
      </div>
      <div> My saved recipes: </div>
      <ol>
        {
          recipeList.map((item) => 
          <li key={item.name}> <a href={item.link} target="_blank" rel="noreferrer"> {item.name} </a> </li>
          )
        }
      </ol>
    </div>
  );
}

