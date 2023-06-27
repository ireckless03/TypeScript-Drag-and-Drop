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
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );

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

    // Validate user input
    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
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
      console.log(title, desc, people);
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
