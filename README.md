# JSON Beauty

JSON Beauty is an interactive and resizable JSON visualizer designed for developers to easily parse and analyze JSON data. It provides an intuitive interface with a code editor on the left and a visualizer canvas on the right. Users can interact with the visual representation of JSON structures, making it easier to explore complex JSON data.

## Features

### 🖊️ Code Editor

- Uses **Monaco Editor** for writing and editing JSON code.
- Provides syntax highlighting and error detection.
- Supports JSON formatting and validation.

### 📊 Visualizer Canvas

- Displays JSON structures as **nodes and edges**.
- Nodes are **interactable and draggable**.
- Clicking on a node reveals **detailed JSON data and its JSON path**.
- Supports **full view and normal view toggling**.
- Displays total count of **nodes and edges**.

### 📂 File Management

- **Import JSON** from local files.
- **Export JSON** after editing.
- Download the entire visualized JSON structure as **SVG, PNG, or JPG**.

### 🔍 View Mode

- Currently, only **basic visualization mode** is supported.
- Future support planned for **Graph and Tree views**.

### 🛠 Tools

- **JSON Query:** Query JSON data within the visualizer.
- **JSON Path:** Retrieve JSON path for specific data points.

### 🔎 JSON Format Validation

- Footer displays **annotations** indicating whether the JSON is properly formatted or contains errors.

## Tech Stack

- **ReactFlow** - For visualizing JSON structure as a flow diagram.
- **Lucide Icons** - For modern, lightweight icons.
- **LDRS UI Ball** - For loading animations and UI enhancements.
- **Tailwind CSS** - For styling and responsive design.
- **Monaco Editor** - For powerful code editing.
- **html-to-image** - For exporting the visualization as images.

## Installation & Setup

```sh
# Clone the repository
git clone https://github.com/your-username/json-beauty.git

# Navigate into the project folder
cd json-beauty

# Install dependencies
npm install

# Start the development server
npm run dev
```
