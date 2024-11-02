import axios from "axios";
import pako from "pako";
import {
  API_ADDRESS,
  HEADER_AUTH,
  IsCompressed,
  WITH_MEDIA_BINARY,
  Header_WebSiteCode,
} from "./Constants";
import DOMPurify from "dompurify";
import jMoment from "moment-jalaali";
import { message, notification } from "antd";
import moment from "moment";

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const list_to_tree = (list = []) => {
  let parents = list?.map((item) => item.MotherID);
  parents = [...new Set(parents)];
  parents = parents?.map((parent) => ({ DomainId: parent, Children: [] }));
  parents?.forEach((parent) => {
    list.forEach((item) => {
      if (item.MotherID == parent.DomainId) {
        parent.Children.push(item);
      }
    });
  });
  return parents;
};

const buildDepthOneTree = (
  list = [],
  idType = "DomainId",
  motherIdCondition = null
) => {
  let roots = list?.filter((item) => item.MotherID === motherIdCondition);
  roots = [...new Set(roots)];
  roots?.forEach((root) => (root.Children = []));
  roots?.forEach((root) => {
    list.forEach((item) => {
      if (item.MotherID == root[idType]) {
        root.Children.push(item);
      }
    });
  });
  return roots;
};

let buildTree = (nodes, key) => {
  nodes.forEach((node, index) => {
    if (!node.key) node.key = node[key] ? node[key] : `key${index}`;
  });
  let roots = nodes.filter(({ MotherID }) => MotherID == null || MotherID == 0);
  if (roots?.length > 0) return buildChildren(roots, nodes);
  else {
    nodes.forEach((node) => {
      let children = [...nodes.filter((n) => n.MotherID == node.ID)];
      if (children?.length > 0) node.children = children;
    });
    roots = nodes.filter((node) => {
      if (node.children?.length > 0) {
        return node;
      }
    });
    if (roots.length === 0) return nodes;
    let ids = roots.map(({ ID }) => ID);
    let motherIds = roots.map(({ MotherID }) => MotherID);
    let interSection = motherIds.filter((mother) => ids.includes(mother));
    while (interSection.length > 0) {
      roots = roots.filter(({ MotherID }) => !interSection.includes(MotherID));
      ids = roots.map(({ ID }) => ID);
      motherIds = roots.map(({ MotherID }) => MotherID);
      interSection = motherIds.filter((mother) => ids.includes(mother)) ?? [];
    }
    return roots;
  }
};

let buildChildren = (roots, nodes) => {
  return roots.map((root) => {
    let children = [...nodes.filter(({ MotherID }) => MotherID == root.ID)];
    if (children?.length > 0) {
      root.children = children;
      buildChildren(children, nodes);
    }
    return root;
  });
};

let renderChildrenData = (children, columns, renderData) => {
  return children.map((child) => {
    columns?.forEach((col) => {
      child[col["dataIndex"]] = renderData(col.type, child, col["dataIndex"]);
    });
    if (child?.children?.length > 0)
      renderChildrenData(child.children, columns, renderData);
    return child;
  });
};

// public bool GrnConfirmPure { get; set; }
//         public bool GrnSavePure { get; set; }
//         public bool GrnNewPure { get; set; }
//         public bool GrnDeletePure { get; set; }
//         public bool GrnNewFromFormPure { get; set; }
//         public bool GrnRollBackPure { get; set; }
//         public bool GrnConfirmWithOperations { get; set; }
//         public bool GrnRollBack { get; set; }
//         public bool GrnSaveWithOperations { get; set; }
//         public bool GrnDeleteWithOperations { get; set; }
//         public bool GrnNewFromFormWithOperations { get; set; }
//         public bool GrnRollBackWithOperations { get; set; }
//         public string GrnThumbnail { get; set; }
//         public bool GrnBeep { get; set; }
//         public List<string> GrnAPI { get; set; }
//         public List<int> GrnPackage { get; set; }
//         public bool GrnNewWithOperations { get; set; }
//         public List<int> GrnFormTypeID { get; set; }
//         public bool GrnNewFromForm { get; set; }
//         public bool GrnScan { get; set; }
//         public List<string> GrnMessages { get; set; }
//         public List<string> GrnErrors { get; set; }
//         public List<string> GrnWarnings { get; set; }
//         public List<string> GrnRefresh { get; set; }
//         public string GrnCalcMaster { get; set; }
//         public string GrnRuleMaster { get; set; }
//         public string GrnFocus { get; set; }
//         public bool GrnScanDirect { get; set; }
//         public List<string> GrnPrint { get; set; }
//         public Dictionary<int, int> GrnThumbnailFormIds { get; set; }
//         public bool HasNoError { get; set; }
//         public bool GrnResult { get; set; }
//         public bool GrnConfirm { get; set; }
//         public bool GrnSave { get; set; }
//         public bool GrnNew { get; set; }
//         public bool GrnDelete { get; set; }
//         public List<string> GrnWork { get; set; }
//         public List<int> GrnFormID { get; set; }

const login = (username, password) => {
  let APIInputs = new Object();
  APIInputs.Username = username;
  APIInputs.Password = password;
  APIInputs.WithPic = "1";
  APIInputs.ApplicationTypeId = "4";
  APIInputs = JSON.stringify(APIInputs);
  APIInputs = Base64.Enc(APIInputs);

  const formData = new FormData();
  formData.append("APIInputs", APIInputs);
  let url = `${API_ADDRESS}/Users/GetUserInitialParameters`;
  return axios.post(url, formData, {
    headers: { Auth: Base64.Enc(HEADER_AUTH) },
  });
};

class Base64 {
  static btoa(input = "") {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }
      block = (block << 8) | charCode;
    }

    return output;
  }

  static atob(input = "") {
    let str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      message.info("در ارتباط با سرور مشکلی پیش آمده است.");
      // throw new Error(
      //   "'atob' failed: The string to be decoded is not correctly encoded."
      // );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }

  static Utf8ArrayToStr(array = []) {
    let out, i, len, c;
    let char2, char3;
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
          break;
        case 14:
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(
            ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
          );
          break;
      }
    }
    return out;
  }
  static Enc(str) {
    let len = str.length;
    let out = "";
    let i = 0;
    while (i < len) {
      let c = str[i++];
      switch (c) {
        case "a":
          out += "s";
          break;
        case "b":
          out += "6";
          break;
        case "c":
          out += "j";
          break;
        case "d":
          out += "E";
          break;
        case "e":
          out += "H";
          break;
        case "f":
          out += "3";
          break;
        case "g":
          out += "X";
          break;
        case "h":
          out += "p";
          break;
        case "i":
          out += "Y";
          break;
        case "j":
          out += "n";
          break;
        case "k":
          out += "U";
          break;
        case "l":
          out += "m";
          break;
        case "m":
          out += "g";
          break;
        case "n":
          out += "O";
          break;
        case "o":
          out += "c";
          break;
        case "p":
          out += "C";
          break;
        case "q":
          out += "2";
          break;
        case "r":
          out += "y";
          break;
        case "s":
          out += "T";
          break;
        case "t":
          out += "b";
          break;
        case "u":
          out += "5";
          break;
        case "v":
          out += "4";
          break;
        case "w":
          out += "1";
          break;
        case "x":
          out += "S";
          break;
        case "y":
          out += "t";
          break;
        case "z":
          out += "L";
          break;
        case "A":
          out += "h";
          break;
        case "B":
          out += "N";
          break;
        case "C":
          out += "R";
          break;
        case "D":
          out += "M";
          break;
        case "E":
          out += "w";
          break;
        case "F":
          out += "e";
          break;
        case "G":
          out += "k";
          break;
        case "H":
          out += "o";
          break;
        case "I":
          out += "Z";
          break;
        case "J":
          out += "8";
          break;
        case "K":
          out += "v";
          break;
        case "L":
          out += "W";
          break;
        case "M":
          out += "r";
          break;
        case "N":
          out += "G";
          break;
        case "O":
          out += "V";
          break;
        case "P":
          out += "z";
          break;
        case "Q":
          out += "9";
          break;
        case "R":
          out += "I";
          break;
        case "S":
          out += "K";
          break;
        case "T":
          out += "A";
          break;
        case "U":
          out += "q";
          break;
        case "V":
          out += "a";
          break;
        case "W":
          out += "x";
          break;
        case "X":
          out += "i";
          break;
        case "Y":
          out += "D";
          break;
        case "Z":
          out += "l";
          break;
        case "1":
          out += "Q";
          break;
        case "2":
          out += "7";
          break;
        case "3":
          out += "0";
          break;
        case "4":
          out += "u";
          break;
        case "5":
          out += "B";
          break;
        case "6":
          out += "J";
          break;
        case "7":
          out += "F";
          break;
        case "8":
          out += "f";
          break;
        case "9":
          out += "P";
          break;
        case "0":
          out += "d";
          break;
        default:
          out += c;
          break;
      }
    }
    return out;
  }

  static Dec(str) {
    let len = str.length;
    let out = "";
    let i = 0;
    while (i < len) {
      let c = str[i++];
      switch (c) {
        case "s":
          out += "a";
          break;
        case "6":
          out += "b";
          break;
        case "j":
          out += "c";
          break;
        case "E":
          out += "d";
          break;
        case "H":
          out += "e";
          break;
        case "3":
          out += "f";
          break;
        case "X":
          out += "g";
          break;
        case "p":
          out += "h";
          break;
        case "Y":
          out += "i";
          break;
        case "n":
          out += "j";
          break;
        case "U":
          out += "k";
          break;
        case "m":
          out += "l";
          break;
        case "g":
          out += "m";
          break;
        case "O":
          out += "n";
          break;
        case "c":
          out += "o";
          break;
        case "C":
          out += "p";
          break;
        case "2":
          out += "q";
          break;
        case "y":
          out += "r";
          break;
        case "T":
          out += "s";
          break;
        case "b":
          out += "t";
          break;
        case "5":
          out += "u";
          break;
        case "4":
          out += "v";
          break;
        case "1":
          out += "w";
          break;
        case "S":
          out += "x";
          break;
        case "t":
          out += "y";
          break;
        case "L":
          out += "z";
          break;
        case "h":
          out += "A";
          break;
        case "N":
          out += "B";
          break;
        case "R":
          out += "C";
          break;
        case "M":
          out += "D";
          break;
        case "w":
          out += "E";
          break;
        case "e":
          out += "F";
          break;
        case "k":
          out += "G";
          break;
        case "o":
          out += "H";
          break;
        case "Z":
          out += "I";
          break;
        case "8":
          out += "J";
          break;
        case "v":
          out += "K";
          break;
        case "W":
          out += "L";
          break;
        case "r":
          out += "M";
          break;
        case "G":
          out += "N";
          break;
        case "V":
          out += "O";
          break;
        case "z":
          out += "P";
          break;
        case "9":
          out += "Q";
          break;
        case "I":
          out += "R";
          break;
        case "K":
          out += "S";
          break;
        case "A":
          out += "T";
          break;
        case "q":
          out += "U";
          break;
        case "a":
          out += "V";
          break;
        case "x":
          out += "W";
          break;
        case "i":
          out += "X";
          break;
        case "D":
          out += "Y";
          break;
        case "l":
          out += "Z";
          break;
        case "Q":
          out += "1";
          break;
        case "7":
          out += "2";
          break;
        case "0":
          out += "3";
          break;
        case "u":
          out += "4";
          break;
        case "B":
          out += "5";
          break;
        case "J":
          out += "6";
          break;
        case "F":
          out += "7";
          break;
        case "f":
          out += "8";
          break;
        case "P":
          out += "9";
          break;
        case "d":
          out += "0";
          break;
        default:
          out += c;
          break;
      }
    }
    return out;
  }

  static arrayBufferToBase64(buffer) {
    var binary = "";
    if (buffer) {
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
  }

  static arrayBufferToBase64V2(buffer) {
    if (buffer) return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  static Reverse(str) {
    return str?.split("").reverse().join("");
  }

  static resolveResponse(res, reverse = true) {
    let strData = "";
    if (res) {
      if (reverse) res = this.Reverse(res);

      strData = this.atob(res);
      let charData = strData.split("").map(function (x) {
        return x.charCodeAt(0);
      });
      let data = pako.inflate(charData);
      strData = this.Utf8ArrayToStr(data);
      let dataObj = JSON.parse(strData);
      return dataObj;
    }
  }

  static checkEmpty(val) {
    return val == null || val == undefined || val.trim() == "";
  }

  static showNotification(title, message) {
    notification.open({
      message: title,
      description: message,
      placement: "top",
    });
  }
}

const mapPageStyleToPage = (StyleId) => {
  switch (StyleId) {
    case 1:
      return "/";
    case 2:
      return "/about";
    case 3:
      return "/services";
    case 4:
      return "/service-details";
    case 5:
      return "/portfolio";
    case 6:
      return "/portfolio-details";
    case 7:
      return "/team";
    case 8:
      return "/pricing";
    case 9:
      return "/faq";
    case 10:
      return "/error";
    case 11:
      return "contact";
    case 12:
      return "/blog";
    case 13:
      return "/blog2";
    case 14:
      return "/blog3";
    case 15:
      return "/blog-details";
    case 16:
      return "/privacy-policy";
    case 17:
      return "/terms-conditions";
    case 18:
      return "/reports";
    case 19:
      return "/forms";
    case 20:
      return "/download";
    case 21:
      return "/purchase";
    case 22:
      return "/news";
    default:
      return "/";
  }
};

const handleBreaks = (str, color) => {
  // str = str.replace("\n", "");
  if (str.indexOf("Bullet") >= 0) {
    str = str.replace("\n", "");
    let bulletList = str.split("{Bullet::check}");
    bulletList.shift();
    return (
      // body-bullets  text-rendering
      <ul className="body-bullets">
        {bulletList.map((itm) => {
          itm = itm.replace("\n", "");
          return (
            <li className="pe-7s-check">
              <span style={{ color: "black", fontFamily: "IRANSans" }}>
                {itm}
              </span>
            </li>
          );
        })}
      </ul>
    );
  } else {
    str = str.replace("\n", "");
    return str.split(/{break}|\n/).map((string, i) => {
      // string = string.replace("\n", "");
      // if (string.trim().length)
      if (string.trim().length)
        return (
          <p
            style={{ color: `${color}`, padding: 0, margin: 0 }}
            key={"txt" + i}
          >
            {string}
          </p>
        );
      else {
        return <br style={{ padding: 0, margin: 0 }} />;
      }
    });
  }
};

const renderString = (str) => {
  let color = "black";
  if (str?.length) {
    let colors = str.match(/{Color::.*}/g);
    let paragraphs = str.split(/{Color::.*}/);
    paragraphs.shift();
    if (paragraphs.length)
      return paragraphs.map((sec, index) => {
        color = colors[index].substring(8, colors[index].length - 1);
        return handleBreaks(sec, color);
      });
    else
      return str.split("\n").map((parag, index) => {
        return <p key={"body" + index}>{parag}</p>;
      });
  }
  return "";
};

const renderHTML = ({ Body, Images, Movies }) => {
  let seprateTagsRegExp = /(<([^>]+)>([^<\/*>])*<\/([^>]+)>|<\/.?>)/gi;
  let Tags = Body?.match(seprateTagsRegExp);
  if (Tags?.length) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(modifyTag(Body, Images, Movies)),
        }}
      />
    );
  } else return renderString(Body);
};

const modifyTag = (body, images, movies) => {
  // let fullParagraphRegex = /(<\s*p\s*\S*>)([^<]*)(<\s*\/\s*p\s*\S*>)/gi;
  // let fullTextRegex = /(<\s*text\s*\S*>)([^<]*)(<\s*\/\s*text\s*\S*>)/gi;
  // let paragraphRegex = /(<\s*p\s*\S*>)/gi;
  // let textRegex = /(<\s*(\/)*\s*text\s*\S*>)/gi;
  // let paragraphTags = body.match(paragraphRegex);
  let imgRegex = /<([^>]*)img([^>]*)>/gi;
  let imgAttributeRegex = /name\s*=\s*(("|')(.*)("|'))/gi;
  let imgNameAttValueRegex = /("|')(.*)("|')/gi;
  let ulRegexG = /(<\s*ul\s*([^>]*)\s*>)/gi;
  let ulRegex = /(<\s*ul\s*([^>]*)\s*>)/i;
  let ulAttributeRegex = /(\s*ul\s*([^>]*)\s*)/gi;
  let videoRegex = /<([^>]*)video([^>]*)>/gi;
  let imageTags = body.match(imgRegex);
  let ulTags = body.match(ulRegexG);
  let videoTags = body.match(videoRegex);

  // let textTags = body.match(fullTextRegex);
  // console.log(textTags, "text tags");

  // if (paragraphTags?.length) {
  //   paragraphTags.forEach((paragraph) => {
  //     console.log(paragraph);
  //     let pTagContentRegex = /(\s*p\s*([^>]*))/gi;
  //     let pTagStyleRegex = /style\s*=\s*(('|")([^"']*)('|"))/gi;

  //     let pTagStyle = paragraph.match(pTagStyleRegex);
  //     let pTagStyleContent;
  //     if (pTagStyle?.length) pTagStyleContent = pTagStyle[0];
  //     let pTagContent = paragraph.match(pTagContentRegex);
  //     console.log(pTagContent, "pTagContent");
  //     console.log(pTagStyle, "pTagStyle");
  //     body = body?.replace(
  //       pTagContentRegex,
  //       pTagContent[0] + ' class="body-text"'
  //     );
  //   });
  // }
  if (imageTags?.length) {
    imageTags.forEach((img) => {
      let imageName = img.match(imgNameAttValueRegex)[0].replace(/("|')/g, "");
      let imageAttribute = img.match(imgAttributeRegex);
      let image = images?.find((img) => img.FileName == imageName);
      body =
        image && imageAttribute?.length
          ? body?.replace(
              imageAttribute,
              `src='/media/${
                image.ID + image.MediaExtention
              }' style='display:block; margin:auto; max-width:100%; max-height:100%'`
            )
          : body;
    });
  }
  if (ulTags?.length) {
    ulTags.forEach((ul, index) => {
      let attribute = ul.match(ulAttributeRegex);
      if (attribute?.length) {
        attribute = `<${attribute[0]} class="body-bullets">`;
        body = body?.replace(ul, attribute);
      } else body = body?.replace(ul, '<ul class="body-bullets">');
    });
  }
  if (videoTags?.length) {
    videoTags.forEach((video) => {
      if (video.toLowerCase() != "</video>") {
        var temp = document.createElement("video");
        temp.innerHTML = video + "</video>";
        temp = temp.firstElementChild.attributes;
        var list = Object.keys(temp).map(function (index) {
          return temp[index];
        });
        let name = list[0].value;
        let poster = list[1].value;
        let image = images?.find((img) => img.FileName == poster);
        let videosrc = movies?.find((img) => img.FileName == name);

        body = body?.replace(
          video,
          "<video poster='/media/" +
            image.ID +
            ".jpg' controls><source src='/media/" +
            videosrc.ID +
            ".mp4' type='video/mp4'/></video>"
        );
      } else body = body?.replace("</video>", "");
    });
  }
  // <video name='HR' poster='HR' />
  // if (textTags?.length) {
  //   textTags.forEach((p, index) => {
  //     let tags = p.match(textRegex);
  //     tags.forEach((p) => {
  //       let pTag = p.replace(/text/i, "p");
  //       console.log(p);
  //       console.log(pTag);
  //       console.log(body);

  //       body = body.replace(p, pTag);
  //       console.log(body);
  //     });
  //     // txt=txt.replace(/paragraph/ig , 'p')
  //     // if (attribute?.length) {
  //     //   attribute = `<${attribute[0]} class="body-bullets">`;
  //     //   body = body?.replace(ul, attribute);
  //     // } else body = body?.replace(ul, '<ul class="body-bullets">');
  //     // console.log(txt.match(textRegex));
  //   });
  // }
  return body;
};

const getCaption = (id, Captions) => {
  let caption = "";
  if (Captions.length) {
    caption = Captions.filter(({ ID }) => {
      if (ID == id) return ID;
    })[0];
    if (caption) return caption.Caption ? caption.Caption : "";
  } else {
    return caption;
  }
};

const SeparateNumber = (x) => {
  if (x > 1000) return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return x;
};

const SeparateNumber2 = (x) => {
  if (x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } else return x;
};

const setUrlParameters = (id, str, PreviousFormTypeID, PreviousFormID) => {
  if (PreviousFormTypeID && PreviousFormID)
    return {
      id,
      FTI: PreviousFormTypeID,
      FI: PreviousFormID,
      erp: str.replace(/ |\u200c/g, "-"),
    };
  else
    return {
      id,
      erp: str
        .replace(/ |\u200c/g, "-")
        .replace(/\s/g, "-")
        .replace("(", "-")
        .replace(")", "-")
        .replace("&", "-"),
    };
};

const getCanonicalUrl = (canonicalUrl) => {
  let result =
    "https://" +
    canonicalUrl?.hostname +
    (canonicalUrl?.search
      ? canonicalUrl?.pathname
      : canonicalUrl?.pathname.substring(
          0,
          canonicalUrl?.pathname.length - 1
        )) +
    (canonicalUrl?.search.length > 0
      ? canonicalUrl?.searchParams
          ?.get("erp")
          .replace(/ |\u200c/g, "-")
          .replace(/\s/g, "123")
          .replace("(", "-")
          .replace(")", "-")
          .replace("&", "-")
      : "");

  return result;
};

const getPage = ({
  pageStyleTypeID,
  pageSectionStyleTypeID,
  pageId,
  tblPersonStatuses,
  userId,
  justPageMainData = false,
  LangID = 5,
}) => {
  let url;
  tblPersonStatuses = tblPersonStatuses?.filter((item) => {
    if (item.IsLastSelection == true) return item;
  })[0];
  const formData = new FormData();
  let RunTimeOperandsModel = new Object();
  if (tblPersonStatuses) {
    RunTimeOperandsModel.SelectedArchiveID = null;
    RunTimeOperandsModel.SelectedPersonalFolderID = null;
    RunTimeOperandsModel.CurrentCompanyID = `${tblPersonStatuses.tblPosition.CompanyID}`;
    RunTimeOperandsModel.CurrentDepartmentID = `${tblPersonStatuses.tblPosition.DepartmentID}`;
    RunTimeOperandsModel.CurrentFormXMLData = null;
    RunTimeOperandsModel.CurrentLanguageID = 5;
    RunTimeOperandsModel.CurrentPositionID = `${tblPersonStatuses.PersonPositionID}`;
    RunTimeOperandsModel.CurrentProcessID = -1;
    RunTimeOperandsModel.ProcessStepID = -1;
    RunTimeOperandsModel.TeamID = `${tblPersonStatuses.PersonTeamID}`;
    RunTimeOperandsModel.UserID = `${userId}`; //check
    RunTimeOperandsModel.WorkID = -1;
    RunTimeOperandsModel.ScheduledFormTypeID = -1;
    RunTimeOperandsModel.ScheduledFormID = -1;
    RunTimeOperandsModel.PreviousFormTypeID = -1;
    RunTimeOperandsModel.PreviousFormID = -1;
    RunTimeOperandsModel.CurrentComponentID = -1;
    RunTimeOperandsModel.FormIDList = null;
    RunTimeOperandsModel = JSON.stringify(RunTimeOperandsModel);
    RunTimeOperandsModel = Base64.Enc(RunTimeOperandsModel);
    formData.append("RunTimeOperandsModel", RunTimeOperandsModel);
  }

  if (pageStyleTypeID)
    url = `${API_ADDRESS}/GreenWeb/GetPage?pageStyleTypeID=${pageStyleTypeID}&LangID=${LangID}${
      pageSectionStyleTypeID
        ? "&PageSectionStyleTypeID=" + pageSectionStyleTypeID
        : ""
    }&JustPage=${justPageMainData}${IsCompressed}${WITH_MEDIA_BINARY}`;
  else
    url = `${API_ADDRESS}/GreenWeb/GetPage?ID=${pageId}&LangID=${LangID}${
      pageSectionStyleTypeID
        ? "&PageSectionStyleTypeID=" + pageSectionStyleTypeID
        : ""
    }&JustPage=${justPageMainData}${IsCompressed}${WITH_MEDIA_BINARY}`;

  if (url)
    return axios.post(url, formData, {
      headers: {
        Auth: Base64.Enc(HEADER_AUTH),
        WebSiteCode: Header_WebSiteCode,
      },
    });
};

const FetchCountries = () => {
  let url = `${API_ADDRESS}/AIS/FetchCountries`;
  return axios.get(url, {
    headers: { WebSiteCode: Header_WebSiteCode },
  });
};

const RegisterSiteMember = (Data, Password) => {
  let url = `${API_ADDRESS}/AIS/RegisterSiteMember`;
  const formData = new FormData();
  formData.append("Data", JSON.stringify(Data));
  formData.append("Password", Password);
  return axios.post(url, formData, {
    headers: { WebSiteCode: Header_WebSiteCode },
  });
};

const LoginSiteMember = (Username, Password) => {
  let url = `${API_ADDRESS}/AIS/LoginSiteMember`;
  const formData = new FormData();
  formData.append("Username", Username);
  formData.append("Password", Password);
  return axios.post(url, formData, {
    headers: { WebSiteCode: Header_WebSiteCode },
  });
};

const AddEvent = (EventName, StartDate, EndDate, OrganizationID) => {
  let url = `${API_ADDRESS}/AIS/AddEvent`;
  const formData = new FormData();
  formData.append("EventName", EventName);
  formData.append("StartDate", StartDate);
  formData.append("EndDate", EndDate);
  formData.append("OrganizationID", OrganizationID);
  return axios.post(url, formData, {
    headers: { WebSiteCode: Header_WebSiteCode },
  });
};

const FetchOrganizationEvents = (OrganizationID) => {
  let url = `${API_ADDRESS}/AIS/FetchOrganizationEvents`;
  const formData = new FormData();
  formData.append("OrganizationID", OrganizationID);
  return axios.post(url, formData, {
    headers: { WebSiteCode: Header_WebSiteCode },
  });
};

const FetchJudges = () => {
  let url = `${API_ADDRESS}/AIS/FetchJudges`;
  return axios.post(url, null, {
    headers: { WebSiteCode: Header_WebSiteCode },
  });
};

const FetchOrganizationEventJudges = (EventID) => {
  let url = `${API_ADDRESS}/AIS/FetchOrganizationEventJudges`;
  const formData = new FormData();
  formData.append("EventID", EventID);
  return axios.post(url, formData, {
    headers: { WebSiteCode: Header_WebSiteCode },
  });
};

const AddOrganizationEventJudges = (EventID, JudgeID) => {
  let url = `${API_ADDRESS}/AIS/AddOrganizationEventJudges`;
  const formData = new FormData();
  formData.append("EventID", EventID);
  formData.append("JudgeID", JudgeID);
  return axios.post(url, formData, {
    headers: { WebSiteCode: Header_WebSiteCode },
  });
};

const persianToEnglishNumbers = (persianNumber) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";

  return persianNumber
    .toString()
    .split("")
    .map((char) => {
      const index = persianDigits.indexOf(char);
      return index !== -1 ? englishDigits[index] : char;
    })
    .join("");
};
const getJalaliData = (date, language = 5) => {
  if (language == 5) {
    if (date) return jMoment(date).format("jYYYY/jM/jD");
    else return jMoment().format("jYYYY/jM/jD");
  } else {
    if (date)
      return persianToEnglishNumbers(
        moment(date).local("en").format("YYYY-DD-MM")
      );
    else
      return persianToEnglishNumbers(moment().local("en").format("YYYY-DD-MM"));
  }
};

const renderTree = (subMenus) => {
  return subMenus
    ?.filter(
      (item) => this.props.userVisibilityLevel >= item.VisibleLevelTypeID
    )
    ?.map((sub, i) => {
      return (
        <li className="nav-item" key={`subMenuItem${i}`}>
          <Link
            href={{
              pathname: mapPageStyleToPage(sub["PageStyleTypeID"]),
              query: sub["PageID"]
                ? setUrlParameters(sub["PageID"], sub["ToTitle"])
                : null,
            }}
          >
            <a className="nav-link">{sub.Title}</a>
          </Link>
        </li>
      );
    });
};

const FetchSpecificEvent = (EventID) => {
  let url = `${API_ADDRESS}/AIS/FetchEventData`;
  const formData = new FormData();
  formData.append("EventID", EventID);
  return axios.post(url, formData, {
    headers: { WebSiteCode: Header_WebSiteCode },
  });
};

export {
  FetchSpecificEvent,
  list_to_tree,
  buildTree,
  buildDepthOneTree,
  renderChildrenData,
  login,
  Base64,
  mapPageStyleToPage,
  renderString,
  getCaption,
  SeparateNumber,
  SeparateNumber2,
  setUrlParameters,
  getPage,
  getJalaliData,
  renderHTML,
  getCanonicalUrl,
  persianToEnglishNumbers,
  FetchCountries,
  RegisterSiteMember,
  LoginSiteMember,
  AddEvent,
  FetchOrganizationEvents,
  FetchJudges,
  FetchOrganizationEventJudges,
  AddOrganizationEventJudges,
};
