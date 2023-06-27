// Project State management

class ProjectState {
  // array of function refs
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  // create new ProjectState if not already existing
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // adds a listener function
  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  // add projects to project list
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople,
    };
    this.projects.push(newProject);

    // all listener functions being executed on the copy of projects
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
// create instance of projectstate to use globally
const projectState = ProjectState.getInstance();

// Validation Interface with mandatory value and optional propers
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
// improved validation function
function validate(validatableInput: Validatable) {
  let isValid = true;

  // checks for an input
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  // checks for min length input
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }

  // checks for max length input
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }

  // checks input value is above min
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  // checks if input value is below max
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

// autobind decorator
function autobind(_1: any, _2: string, descriptor: PropertyDescriptor) {
  // storing original method
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// Project List Class to render
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  // storing value in that prop
  constructor(private type: "active" | "finished") {
    // selecting project-list element
    this.templateElement = 
      document.getElementById("project-list")! as HTMLTemplateElement;

    // Get the host div element
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];

    // Import the content of the template element and create a new node
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // Get the first element(section) from project-list and store it
    this.element = importedNode.firstElementChild as HTMLElement;
    // access to dynamic core elements
    this.element.id = `${this.type}-projects`;

    // adding projects to assignedProjects
    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  // selects the
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  //render content inside the header/h2
  private renderContent() {
    const listId = `${this.type}-projects-list`;
    // selects ul under the listid
    this.element.querySelector("ul")!.id = listId;
    //setting text content of h2 tag
    this.element.querySelector("h2")!.textContent =
      this.type.toLocaleUpperCase() + " PROJECTS";
  }

  // render list to dom, before closing tag of host element
  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

// Project Input Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // Get the template element
    this.templateElement = 
      document.getElementById("project-input")! as HTMLTemplateElement;

    // Get the host div element
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // Import the content of the template element and create a new node
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // Get the first child element of the imported node, assuming it's a form element
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    //storing inputs as properties
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    // Attach the form element to the host div
    this.configure();
    this.attach();
  }

  // used to gather all info from user input, validate and return
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // validatable object properties
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    // Validate user input
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input! Try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  // clear all inputs after adding project
  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }
  //bind to a method
  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  // .bind(this) - passing this will refer to class
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    // Insert the form element as the first child of the host div
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

// Create an instance of the ProjectInput class
const projInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
