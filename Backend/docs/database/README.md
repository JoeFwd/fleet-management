# PlantUML Setup and Diagram Generation

![Conceptual Data Model Diagram](./conceptual-data-model-diagram.png)

Follow these steps to setup PlantUML and generate the diagram:

1. **Download PlantUML**

Download [PlantUML](https://plantuml.com/en/download) from the official website or via [GitHub](https://github.com/plantuml/plantuml/releases). It should be a binary file named ```plantuml-{latest-version}.jar```

2. **Install Java**

Make sure you have Java 8+ installed on your machine.

3. **Generate the Diagram**

You can now generate the diagram from the conceptual-data-model-diagram.puml source file with the following command line:

```bash
java -jar plantuml.jar conceptual-data-model-diagram.puml
```

This will generate a ```conceptual-data-model-diagram.png``` file in the same directory.

4. **Maintenance**

You can just reuse the components from the source file in order to add a new table or add/edit a column.

If you require more advanced modelisation, you can checkout [PlantUML's guide](https://plantuml.com/en/guide).
