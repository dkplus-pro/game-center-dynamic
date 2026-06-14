package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// thriftFile represents a parsed Thrift file with its struct definitions.
type thriftFile struct {
	namespace string
	includes  []string
	structs   []thriftStruct
}

type thriftStruct struct {
	name   string
	fields []thriftField
}

type thriftField struct {
	id       string
	typeName string
	name     string
	isList   bool
}

func main() {
	idlDir := "idl"
	outDir := filepath.Join("..", "packages", "types", "src", "generated")

	// Ensure output directory exists
	os.MkdirAll(outDir, 0755)

	// Parse all .thrift files
	files := map[string]*thriftFile{}
	entries, err := os.ReadDir(idlDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading idl directory: %v\n", err)
		os.Exit(1)
	}

	for _, entry := range entries {
		if !strings.HasSuffix(entry.Name(), ".thrift") {
			continue
		}
		path := filepath.Join(idlDir, entry.Name())
		data, err := os.ReadFile(path)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error reading %s: %v\n", path, err)
			os.Exit(1)
		}
		files[entry.Name()] = parseThrift(string(data))
	}

	// Generate TypeScript for common types
	common := files["common.thrift"]
	if common != nil {
		ts := generateTS(common)
		outPath := filepath.Join(outDir, "common.ts")
		if err := os.WriteFile(outPath, []byte(ts), 0644); err != nil {
			fmt.Fprintf(os.Stderr, "Error writing %s: %v\n", outPath, err)
			os.Exit(1)
		}
		fmt.Printf("Generated %s\n", outPath)
	}

	// Generate index.ts
	index := `// Auto-generated from Thrift IDL — do not edit manually.
export * from './common';
`
	indexPath := filepath.Join(outDir, "index.ts")
	if err := os.WriteFile(indexPath, []byte(index), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing %s: %v\n", indexPath, err)
		os.Exit(1)
	}
	fmt.Printf("Generated %s\n", indexPath)

	fmt.Println("Codegen complete.")
}

var (
	structRe  = regexp.MustCompile(`struct\s+(\w+)\s*\{([^}]*)\}`)
	fieldRe   = regexp.MustCompile(`(\d+):\s*(list<(\w+)>|(\w+))\s+(\w+)`)
	includeRe = regexp.MustCompile(`include\s+"([^"]+)"`)
	nsRe      = regexp.MustCompile(`namespace\s+\w+\s+(\w+)`)
)

func parseThrift(content string) *thriftFile {
	f := &thriftFile{}

	if m := nsRe.FindStringSubmatch(content); m != nil {
		f.namespace = m[1]
	}

	for _, m := range includeRe.FindAllStringSubmatch(content, -1) {
		f.includes = append(f.includes, m[1])
	}

	for _, m := range structRe.FindAllStringSubmatch(content, -1) {
		st := thriftStruct{name: m[1]}
		body := m[2]
		for _, fm := range fieldRe.FindAllStringSubmatch(body, -1) {
			tf := thriftField{
				id:   fm[1],
				name: fm[5],
			}
			if fm[3] != "" {
				tf.isList = true
				tf.typeName = fm[3]
			} else {
				tf.typeName = fm[4]
			}
			st.fields = append(st.fields, tf)
		}
		f.structs = append(f.structs, st)
	}

	return f
}

func generateTS(f *thriftFile) string {
	var buf strings.Builder

	buf.WriteString("// Auto-generated from Thrift IDL — do not edit manually.\n\n")

	for _, st := range f.structs {
		buf.WriteString(fmt.Sprintf("export interface %s {\n", st.name))
		for _, fld := range st.fields {
			tsType := thriftToTS(fld.typeName, fld.isList)
			buf.WriteString(fmt.Sprintf("  %s: %s;\n", fld.name, tsType))
		}
		buf.WriteString("}\n\n")
	}

	return buf.String()
}

func thriftToTS(thriftType string, isList bool) string {
	typeName := thriftType
	switch thriftType {
	case "string":
		typeName = "string"
	case "i32", "i64", "double":
		typeName = "number"
	case "bool":
		typeName = "boolean"
	default:
		// Custom type — keep as-is (e.g., PageComponent, GameInfo)
	}

	if isList {
		return fmt.Sprintf("%s[]", typeName)
	}
	return typeName
}