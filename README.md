
![SVG-Builder Icon](/dist/SVG-Builder-Icon.png)

# SVG-Builder-UI, a user interface for SVG-Builder-core


## What can I do on the site?

The easy to lead, drag and drop UI allows people to create their own widgets, design them and maintain!

> [!WARNING]
> The project is only on it's really early steps, expect a lot of bugs! Will appreciate everyone who would report bugs into 'Issues' section!


## Where can I find the site? 

  - Site can be accessed via this link: [https://svg-builder-ui.vercel.app/](https://svg-builder-ui.vercel.app/)

## Plans

  - [ ] Add sidebar to pick new instances from, such as `Box.tsx`, `Circle.tsx`, etc...
  - [ ] Add presets of my widgets so creating from scratch would be easier!
  - [ ] Make the drag and drop interface that will be easy to lead.
  - [ ] Add basic modifiers, such as rotation, opacity, color...
  - [ ] The visual design that user create will be converted into a list of instructions `config.json` to be used as a blueprint.
  - [ ] Make sure `config.json` and `/core` code can read and write the file right.[^1]
  - [ ] Compile button that will send a request to SVG-Builder `/core` to render both light and dark themed widgets.[^1]
  - [ ] Support different formats, such as `.svg`, `.png`, `.jpeg`, and others.

## Currently Working

  - TOP PRIORITY: Rework `/hooks.useDragger.ts` to be compatible with `/hooks.useInstanceMenu.ts` and future resize/roatate hook `/hooks.useItemTransformator`.
  - Creating early basic interface without backend for now.
  - Brainshtorming the resize, rotation functionality.
  - Menu that appears after clicking on the item.

## Development Blog

  - 05.10.26 – The first version of code along with the site was released!
  - 06.10.26 – Some preparations for the future, such as indexing files in `index.ts` files.
  - 07.10.26 - Code for instance menu and some additional css sheets for easier work.


[^1]: `/core` code reffering other Repository that generates widget, you can find it [here](https://github.com/Dr9nja/SVG-Builder)


