import { Editor } from "@tiptap/core"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind class merge utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Keyboard shortcut display parser
export function parseShortcutKeys(keys: string | string[]): string {
  const str = Array.isArray(keys) ? keys.join("+") : String(keys)
  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  return str
    .replace(/Mod/g, isMac ? "⌘" : "Ctrl")
    .replace(/Shift/g, isMac ? "⇧" : "Shift")
    .replace(/Alt/g, isMac ? "⌥" : "Alt")
}
// Editor position helpers
export function isValidPosition(posOrEditor: any, pos?: number): boolean {
  if (typeof posOrEditor === "number") {
    return posOrEditor >= 0
  }
  if (pos !== undefined) {
    const { doc } = posOrEditor.state
    return pos >= 0 && pos <= doc.content.size
  }
  return false
}

export function focusNextNode(editor: Editor, pos: number) {
  const next = pos + 1
  if (isValidPosition(editor, next)) {
    editor.chain().focus().setTextSelection(next).run()
  }
}

// Schema checks
export function isNodeInSchema(nodeName: string, editor: Editor | null): boolean {
  if (!editor) return false
  return !!editor.schema.nodes[nodeName]
}

export function isMarkInSchema(markName: string, editor: Editor | null): boolean {
  if (!editor) return false
  return !!editor.schema.marks[markName]
}

export function isExtensionAvailable(editor: Editor | null, name: string): boolean {
  if (!editor) return false
  return !!editor.extensionManager.extensions.find((ext) => ext.name === name)
}

// Selection helpers
export function isNodeTypeSelected(editor: Editor | null, types: string | string[]): boolean {
  if (!editor) return false
  const { from, to } = editor.state.selection
  const typeArray = Array.isArray(types) ? types : [types]
  let isSelected = false
  editor.state.doc.nodesBetween(from, to, (node) => {
    if (typeArray.includes(node.type.name)) {
      isSelected = true
    }
  })
  return isSelected
}

export function getSelectedNodesOfType(editor: Editor, typeName: string) {
  const { from, to } = editor.state.selection
  const nodes: { node: any; pos: number }[] = []
  editor.state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === typeName) {
      nodes.push({ node, pos })
    }
  })
  return nodes
}

export function updateNodesAttr(
  editor: Editor,
  typeName: string,
  attrs: Record<string, any>
) {
  const { from, to } = editor.state.selection
  editor.state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === typeName) {
      editor.chain().setNodeSelection(pos).updateAttributes(typeName, attrs).run()
    }
  })
}

// Image upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function handleImageUpload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("File size exceeds 5MB limit"))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export function findNodePosition({ editor, node }: { editor: any; node: any }): { pos: number } | null {
  if (!editor || !node) return null
  const { doc } = editor.state
  let found: { pos: number } | null = null
  doc.descendants((n: any, pos: number) => {
    if (n === node && found === null) {
      found = { pos }
      return false
    }
  })
  return found
}

export function getSelectedBlockNodes(editor: Editor) {
  const { from, to } = editor.state.selection
  const nodes: { node: any; pos: number }[] = []
  editor.state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isBlock) {
      nodes.push({ node, pos })
    }
  })
  return nodes
}

const CONVERTIBLE_TYPES = ["paragraph", "heading", "blockquote", "codeBlock"]

export function selectionWithinConvertibleTypes(editor: Editor, types?: string[]): boolean {
  const convertibleTypes = types || CONVERTIBLE_TYPES
  const { from, to } = editor.state.selection
  let allConvertible = true
  editor.state.doc.nodesBetween(from, to, (node) => {
    if (node.isBlock && !node.isTextblock && node.type.name !== "doc") {
      if (!convertibleTypes.includes(node.type.name)) {
        allConvertible = false
      }
    }
  })
  return allConvertible
}

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim()
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return ""
  }
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith("/") && !trimmed.startsWith("mailto:")) {
    return `https://${trimmed}`
  }
  return trimmed
}