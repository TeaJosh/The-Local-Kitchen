import type { NodeWithPos } from "@tiptap/core"
import { Extension } from "@tiptap/core"
import type { EditorState, Transaction } from "@tiptap/pm/state"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    nodeBackground: {
      setNodeBackgroundColor: (backgroundColor: string) => ReturnType
      unsetNodeBackgroundColor: () => ReturnType
      toggleNodeBackgroundColor: (backgroundColor: string) => ReturnType
    }
  }
}

export interface NodeBackgroundOptions {
  types: string[]
  useStyle?: boolean
}

function getToggleColor(
  targets: NodeWithPos[],
  inputColor: string
): string | null {
  if (targets.length === 0) return null
  for (const target of targets) {
    const currentColor = target.node.attrs?.backgroundColor ?? null
    if (currentColor !== inputColor) {
      return inputColor
    }
  }
  return null
}

export const NodeBackground = Extension.create<NodeBackgroundOptions>({
  name: "nodeBackground",

  addOptions() {
    return {
      types: [
        "paragraph",
        "heading",
        "blockquote",
        "taskList",
        "bulletList",
        "orderedList",
      ],
      useStyle: true,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null as string | null,
            parseHTML: (element: HTMLElement) => {
              const styleColor = element.style?.backgroundColor
              if (styleColor) return styleColor
              return element.getAttribute("data-background-color") || null
            },
            renderHTML: (attributes) => {
              const color = attributes.backgroundColor as string | null
              if (!color) return {}
              if (this.options.useStyle) {
                return { style: `background-color: ${color}` }
              }
              return { "data-background-color": color }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    const applyColor = (
      getColor: (targets: NodeWithPos[], inputColor?: string) => string | null,
      inputColor?: string
    ) =>
      ({ state, tr }: { state: EditorState; tr: Transaction }): boolean => {
        const { from, to } = state.selection
        const targets: NodeWithPos[] = []

        state.doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            targets.push({ node, pos })
          }
        })

        if (targets.length === 0) return false

        const targetColor = getColor(targets, inputColor)

        targets.forEach(({ node, pos }) => {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            backgroundColor: targetColor,
          })
        })

        return true
      }

    return {
      setNodeBackgroundColor: (inputColor: string) =>
        applyColor((_, color) => color ?? null, inputColor),

      unsetNodeBackgroundColor: () =>
        applyColor(() => null),

      toggleNodeBackgroundColor: (inputColor: string) =>
        applyColor(
          (targets, color) => getToggleColor(targets, color ?? ""),
          inputColor
        ),
    }
  },
})
