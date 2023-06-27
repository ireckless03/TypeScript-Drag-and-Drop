class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

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

    // Attach the form element to the host div
    this.attach();
  }
  
  private attach() {
    // Insert the form element as the first child of the host div
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

// Create an instance of the ProjectInput class
const projInput = new ProjectInput();
