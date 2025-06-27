export const problems = [
  {
    id: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers, return indices of the two numbers such that they add up to target.",
    languages: ["javascript", "cpp", "java"],
    defaultCode: {
      javascript: `function sumArray(arr) {
  // User writes logic here
  return 0;
}

function main(input) {
  const arr = input.trim().split(" ").map(Number);
  const result = sumArray(arr);
  console.log(result);
}

main(require("fs").readFileSync(0, "utf-8"));

`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int sumArray(const vector<int>& arr) {
    // Write your logic here
    return 0;
}

int main() {
    int num;
    vector<int> arr;
    while (cin >> num) {
        arr.push_back(num);
    }

    int result = sumArray(arr);
    cout << result;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static int sumArray(List<Integer> arr) {
        // Write your logic here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> arr = new ArrayList<>();

        while (sc.hasNextInt()) {
            arr.add(sc.nextInt());
        }

        int result = sumArray(arr);
        System.out.println(result);
    }
}`,
    },
    testCases: [
      { stdin: "2 7 11 15\n9", expected_output: "0 1" },
      { stdin: "3 2 4\n6", expected_output: "1 2" },
    ],
    examples: [{ input: "nums = [2,7,11,15], target = 9", output: "0 1" }],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    description:
      "Create a function that takes a string as input and returns a new string with the characters in reverse order.",
    languages: ["javascript", "cpp", "java"],
    defaultCode: {
      javascript: `process.stdin.resume();
process.stdin.setEncoding("utf8");

let input = "";

process.stdin.on("data", function (chunk) {
  input += chunk;
});

process.stdin.on("end", function () {
  input = input.trim();
  const result = reverseString(input);
  console.log(result);
});

function reverseString(str) {
  //Write your logic here
}
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

string reverseString(string str) {
    // your logic here
}

int main() {
    string input;
    getline(cin, input);
    cout << reverseString(input) << endl;
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static String reverseString(String str) {
        // your logic here
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        System.out.println(reverseString(input));
    }
}
`,
    },
    testCases: [
      { stdin: "hello", expected_output: "olleh" },
      { stdin: "world", expected_output: "dlrow" },
    ],
    examples: [{ input: `"hello"`, output: `"olleh"` }],
  },
];
