figma.showUI(__html__, { themeColors: true, height: 350 });

function rgbToHex(r, g, b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [h, s, l];
}

function unitConvert(unit){
  var output = unit
  if(unit === "PIXELS"){
    output = "px"
  }
  else if(unit === "PERCENT"){
    output ="%"
  }
  else if(unit === "AUTO"){
    output ="Auto"
  }

  return output
}

async function createColorDocTemplate(styles) {

  const newComp = figma.createComponent()
  newComp.resize(200, 150)
  newComp.name = "@ColorDocTemplate"
  newComp.layoutMode = "VERTICAL"
  //newComp.counterAxisSizingMode = "AUTO"


  const color = figma.createRectangle()
  color.resize(150, 150)

  const textBlock = figma.createFrame()
  textBlock.layoutMode = "VERTICAL"
  textBlock.counterAxisSizingMode = "AUTO"

  const colorValues = figma.createFrame()
  colorValues.layoutMode = "VERTICAL"
  colorValues.counterAxisSizingMode = "AUTO"


  const name = figma.createText()

  const spacer = figma.createRectangle()
  spacer.resize(40, 1)

  const rgbBlock = figma.createFrame()
  rgbBlock.layoutMode = "HORIZONTAL"
  rgbBlock.counterAxisSizingMode = "AUTO"

  const rBlock = figma.createFrame()
  rBlock.layoutMode = "HORIZONTAL"
  rBlock.counterAxisSizingMode = "AUTO"

  const gBlock = figma.createFrame()
  gBlock.layoutMode = "HORIZONTAL"
  gBlock.counterAxisSizingMode = "AUTO"

  const bBlock = figma.createFrame()
  bBlock.layoutMode = "HORIZONTAL"
  bBlock.counterAxisSizingMode = "AUTO"

  const r = figma.createText()
  const RGBr = figma.createText()

  const g = figma.createText()
  const RGBg = figma.createText()

  const b = figma.createText()
  const RGBb = figma.createText()

  const hexBlock = figma.createFrame()
  hexBlock.layoutMode = "HORIZONTAL"
  hexBlock.counterAxisSizingMode = "AUTO"

  const hexText = figma.createText()
  const hex = figma.createText()

  newComp.appendChild(color)

  textBlock.appendChild(name)
  textBlock.appendChild(spacer)

  hexBlock.appendChild(hexText)
  hexBlock.appendChild(hex)

  colorValues.appendChild(hexBlock)

  rBlock.appendChild(r)
  rBlock.appendChild(RGBr)
  gBlock.appendChild(g)
  gBlock.appendChild(RGBg)
  bBlock.appendChild(b)
  bBlock.appendChild(RGBb)
  rgbBlock.appendChild(rBlock)
  rgbBlock.appendChild(gBlock)
  rgbBlock.appendChild(bBlock)
  
  colorValues.appendChild(rgbBlock)

  textBlock.appendChild(colorValues)

  newComp.appendChild(textBlock)

  //Background color
  newComp.fills = []
  rgbBlock.fills = []
  hexBlock.fills = []
  //textBlock.fills = []
  rBlock.fills = []
  gBlock.fills = []
  bBlock.fills = []
  spacer.fills = [{color: {r: 0, g: 0, b: 0}, type: "SOLID"}]

  color.topLeftRadius = 10
  color.topRightRadius = 10
  textBlock.bottomLeftRadius = 10
  textBlock.bottomRightRadius = 10
  textBlock.bottomLeftRadius = 10
  textBlock.paddingTop = 20
  textBlock.paddingBottom = 20
  textBlock.paddingLeft = 20
  textBlock.paddingRight = 20
  textBlock.itemSpacing = 8
  rgbBlock.itemSpacing = 4


  color.name = "@color"
  textBlock.name = "textBlock"
  name.name = "@name"
  rgbBlock.name = "rgbBlock"
  rBlock.name = "rBlock"
  gBlock.name = "gBlock"
  bBlock.name = "bBlock"
  RGBr.name = "@colorRGBr"
  RGBg.name = "@colorRGBg"
  RGBb.name = "@colorRGBb"
  hex.name = "@colorHex"
  hexBlock.name = "hexBlock"

  await figma.loadFontAsync({ family: "Inter", style: "Regular" })

  const regulaLists = [r,RGBr,g,RGBg,b,RGBb,hex,hexText]

  for(const regulaList of regulaLists){
    regulaList.fontName = { family: "Inter", style: "Regular" }
  }


  r.characters = "R"
  RGBr.characters = "RGBr"
  g.characters = "G"
  RGBg.characters = "RGBg"
  b.characters = "B"
  RGBb.characters = "RGBb"
  
  hex.characters = "HEX"
  hex.textCase = "UPPER"
  hexText.characters = "#"


  await figma.loadFontAsync({ family: "Inter", style: "Bold" })

  name.fontName = { family: "Inter", style: "Bold" }


  name.characters = "Name"

  color.layoutAlign = "STRETCH"
  textBlock.layoutAlign = "STRETCH"
  name.layoutAlign = "STRETCH"

  newComp.y = -400
  figma.currentPage.appendChild(newComp)

  createColorDoc(newComp, styles)

}

async function createColorDoc(colorComp, styles) {

  // Create main frame
  const colorDoc = figma.createFrame()
  colorDoc.name = "System Colors"
  const compWidth = colorComp.width
  colorDoc.resize(compWidth, 100)
  colorDoc.layoutMode = "HORIZONTAL"
  colorDoc.counterAxisSizingMode = "AUTO"
  colorDoc.fills = []
  colorDoc.itemSpacing = 20
  

  //Check for fields
  let fields = []
  const compFields = await colorComp.findAll(n => n.name.includes("@"))
  for (const compField of compFields) {
    fields.push(compField.name)
  }

  for (const [s, style] of styles.entries()) {
    const template = await colorComp.createInstance()
    template.name = style.name

    for (const fieldName of fields) {

      const field = template.findOne(n => n.name === fieldName)

      if (!field) {
        return
      }


      // Name
      if (fieldName === "@name") {
        const fonts = await field.getRangeAllFontNames(0, 1) as FontName[]
        await figma.loadFontAsync(fonts[0])
        field.characters = style.name
      }

      // Color
      else if (fieldName === "@color") {

        field.fillStyleId = style.id
      }

      // RGB
      else if (fieldName === "@colorRGBr" || fieldName === "@colorRGBg" || fieldName === "@colorRGBb") {

        if (style.paints[0].type === "SOLID") {



          const r = String((255 * style.paints[0].color.r).toFixed(0))
          const g = String((255 * style.paints[0].color.g).toFixed(0))
          const b = String((255 * style.paints[0].color.b).toFixed(0))

          const fonts = await field.getRangeAllFontNames(0, 1) as FontName[]
          await figma.loadFontAsync(fonts[0])

          if (fieldName === "@colorRGBr") {
            field.characters = r
          } else if (fieldName === "@colorRGBg") {
            field.characters = g
          } else if (fieldName === "@colorRGBb") {
            field.characters = b
          }

        }
        else {
          const fonts = await field.getRangeAllFontNames(0, 1) as FontName[]
          await figma.loadFontAsync(fonts[0])
          field.characters = "-"
        }

      }

      // Opacity
      else if (fieldName === "@colorOpacity") {
        const fonts = await field.getRangeAllFontNames(0, 1) as FontName[]
        await figma.loadFontAsync(fonts[0])
        field.characters = String(style.paints[0].opacity)
      }

      // HEX
      else if (fieldName === "@colorHex") {

        if (style.paints[0].type === "SOLID") {
          const r = Number((255 * style.paints[0].color.r).toFixed(0))
          const g = Number((255 * style.paints[0].color.g).toFixed(0))
          const b = Number((255 * style.paints[0].color.b).toFixed(0))

          let hex = rgbToHex(r, g, b)


          const fonts = await field.getRangeAllFontNames(0, 1) as FontName[]
          await figma.loadFontAsync(fonts[0])
          field.characters = hex
        }
        else {
          const fonts = await field.getRangeAllFontNames(0, 1) as FontName[]
          await figma.loadFontAsync(fonts[0])
          field.characters = "-"
        }
      }


    }

    colorDoc.appendChild(template)
  }

  figma.currentPage.appendChild(colorDoc)

}

async function createFontDocTemplate(styles, previewType, previewText) {

  const globalWith = 140

  const newComp = figma.createComponent()
  newComp.name = "@FontDocTemplate"
  newComp.layoutMode = "HORIZONTAL"
  newComp.counterAxisSizingMode = "AUTO"
  newComp.counterAxisAlignItems = "CENTER"

  const preview = figma.createText()
  const name = figma.createText()
  const family = figma.createText()
  const weight = figma.createText()
  const size = figma.createText()
  const lineheight = figma.createText()
  const lineheightUnit = figma.createText()
  const letterspacing = figma.createText()
  const letterspacingUnit = figma.createText()

  const previewBlock = figma.createFrame()
  const nameBlock = figma.createFrame()
  const familyBlock = figma.createFrame()
  const weightBlock = figma.createFrame()
  const sizeBlock = figma.createFrame()
  const lineheightBlock = figma.createFrame()
  const letterspacingBlock = figma.createFrame() 


  preview.layoutGrow = 1
  previewBlock.layoutMode = "HORIZONTAL"
  previewBlock.resize(globalWith*4, 100)
  previewBlock.counterAxisSizingMode = "AUTO"

  nameBlock.layoutMode = "HORIZONTAL"
  nameBlock.resize(globalWith, 100)
  nameBlock.counterAxisSizingMode = "AUTO"

  familyBlock.layoutMode = "HORIZONTAL"
  familyBlock.resize(globalWith, 100)
  familyBlock.counterAxisSizingMode = "AUTO"

  weightBlock.layoutMode = "HORIZONTAL"
  weightBlock.resize(globalWith, 100)
  weightBlock.counterAxisSizingMode = "AUTO"

  sizeBlock.layoutMode = "HORIZONTAL"
  sizeBlock.resize(globalWith, 100)
  sizeBlock.counterAxisSizingMode = "AUTO"

  lineheightBlock.layoutMode = "HORIZONTAL"
  lineheightBlock.resize(globalWith, 100)
  lineheightBlock.counterAxisSizingMode = "AUTO"

  lineheightBlock.layoutMode = "HORIZONTAL"
  lineheightBlock.resize(globalWith, 100)
  lineheightBlock.counterAxisSizingMode = "AUTO"

  letterspacingBlock.layoutMode = "HORIZONTAL"
  letterspacingBlock.resize(globalWith, 100)
  letterspacingBlock.counterAxisSizingMode = "AUTO"

  lineheightBlock.appendChild(lineheight)
  lineheightBlock.appendChild(lineheightUnit)
  letterspacingBlock.appendChild(letterspacing)
  letterspacingBlock.appendChild(letterspacingUnit)
  
  previewBlock.appendChild(preview)
  newComp.appendChild(previewBlock)

  nameBlock.appendChild(name)
  newComp.appendChild(nameBlock)

  familyBlock.appendChild(family)
  newComp.appendChild(familyBlock)
  
  weightBlock.appendChild(weight)
  newComp.appendChild(weightBlock)

  sizeBlock.appendChild(size)
  newComp.appendChild(sizeBlock)

  newComp.appendChild(lineheightBlock)
  newComp.appendChild(letterspacingBlock)

  newComp.itemSpacing = 20

  previewBlock.fills = []
  nameBlock.fills = []
  familyBlock.fills = []
  sizeBlock.fills = []
  weightBlock.fills = []
  lineheightBlock.fills = []
  letterspacingBlock.fills = []

  preview.name = "@preview"
  name.name = "@name"
  family.name = "@family"
  weight.name = "@weight"
  size.name = "@size"
  lineheight.name = "@lineheight"
  lineheightUnit.name = "@lineheightUnit"
  letterspacing.name = "@letterspacing"
  letterspacingUnit.name = "@letterspacingUnit"

  await figma.loadFontAsync({ family: "Inter", style: "Regular" })
  preview.characters = "Preview"
  name.characters = "Name"
  family.characters = "Family"
  weight.characters = "Weight"
  size.characters = "Size"
  lineheight.characters = "LH"
  lineheightUnit.characters = "LHUnit"
  letterspacing.characters = "LS"
  letterspacingUnit.characters = "LSUnit"

  newComp.y = -400
  figma.currentPage.appendChild(newComp)

  createFontDoc(newComp, styles, previewType, previewText)

}

async function createFontDoc(fontComp, styles, previewType, previewText) {

  // Create main frame
  const fontDoc = figma.createFrame()
  const compWidth = fontComp.width
  fontDoc.resize(compWidth, 100)
  fontDoc.layoutMode = "VERTICAL"
  fontDoc.counterAxisSizingMode = "AUTO"
  fontDoc.fills = []
  fontDoc.itemSpacing = 20
  
  //Check for fields
  let fields = []
  const compFields = await fontComp.findAll(n => n.name.includes("@"))
  for (const compField of compFields) {
    fields.push(compField.name)
  }

  for (const [s, style] of styles.entries()) {
    const template = await fontComp.createInstance()
    template.name = style.name

    for (const fieldName of fields) {

      const field = template.findOne(n => n.name === fieldName)

      if (!field) {
        return
      }

      const fonts = await field.getRangeAllFontNames(0, 1) as FontName[]
      await figma.loadFontAsync(fonts[0])

      // Preview
      if (fieldName === "@preview") {
        
      
          if(previewType === "text"){
            field.characters = previewText
          }
          else if(previewType === "name"){
            field.characters = style.name
          }
          else if(previewType === "name_text"){
            field.characters = style.name + " - " + previewText
          }
      
          field.textStyleId = style.id
 
      }

      // Name
      if (fieldName === "@name") {
        field.characters = style.name
        
      }

      // Family
      if (fieldName === "@family") {
        field.characters = style.fontName.family
      }

      // Weight
      if (fieldName === "@weight") {
        field.characters = style.fontName.style
      }

      // Size
      if (fieldName === "@size") {
        field.characters = String(style.fontSize)
      }

      // LH
      if (fieldName === "@lineheight") {
        if(style.lineHeight.value){
          field.characters = String(parseFloat(style.lineHeight.value.toFixed(2)))
        }else{
          field.visible = false
        }
      }
      if (fieldName === "@lineheightUnit") {
        field.characters = unitConvert(style.lineHeight.unit)
      }

      // LS
      if (fieldName === "@letterspacing") {
        field.characters = String(parseFloat(style.letterSpacing.value.toFixed(2)))
      }
      if (fieldName === "@letterspacingUnit") {
        field.characters = unitConvert(style.letterSpacing.unit)
      }

    }

    fontDoc.appendChild(template)

  }

  figma.currentPage.appendChild(fontDoc)

}

figma.ui.onmessage = msg => {

  if (msg.type === 'generateColorDoc') {

    const styles = figma.getLocalPaintStyles();

    if(styles.length === 0){
      figma.notify("👀 Can't find any color styles in this file...")
      return
    }

    // Custom Color template
    const colorComp = figma.root.findOne(n => n.name === "@ColorDocTemplate");

    if (colorComp) {
      createColorDoc(colorComp, styles)

    } else {
      
      createColorDocTemplate(styles)
    }
  }

  if (msg.type === 'generateFontDoc') {

    const styles = figma.getLocalTextStyles();

    console.log(styles)

    if(styles.length === 0){
      figma.notify("👀 Can't find any font styles in this file...")
      return
    }

    // Custom Color template
    const fontComp = figma.root.findOne(n => n.name === "@FontDocTemplate");

    if (fontComp) {
      createFontDoc(fontComp, styles, msg.previewType, msg.previewText)

    } else {
      createFontDocTemplate(styles, msg.previewType, msg.previewText)
    }

  }

};
