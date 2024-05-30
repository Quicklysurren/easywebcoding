var rows = 3;
var columns = 3;

var currTile; // 현재 드래그 중인 타일
var otherTile; // 빈 타일

var turns = 0; // 턴 수 초기화

// 이미지 순서 설정 (섞인 상태)
var imgOrder = []; // 빈 배열로 초기화

window.onload = function() {
    // 이미지 순서를 랜덤으로 설정
    setRandomImageOrder();

    // 퍼즐 보드 생성
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString(); // 타일 ID 설정
            tile.src = imgOrder.shift() + ".jpg"; // 이미지 소스 설정
            tile.draggable = true; // 드래그 가능하도록 설정

            // 드래그 기능 이벤트 리스너 추가
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            // 보드에 타일 추가
            document.getElementById("board").append(tile);
        }
    }
}

// 이미지 순서를 랜덤으로 설정하는 함수
function setRandomImageOrder() {
    // 1부터 9까지의 숫자를 배열에 추가
    for (let i = 1; i <= 9; i++) {
        imgOrder.push(i.toString());
    }

    // 배열을 랜덤으로 섞음
    for (let i = imgOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imgOrder[i], imgOrder[j]] = [imgOrder[j], imgOrder[i]];
    }
}

// 드래그 시작 시 호출되는 함수
function dragStart() {
    currTile = this; // 드래그 중인 타일을 가리킴
}

// 드래그 중인 요소가 다른 요소 위로 올라갈 때 호출되는 함수
function dragOver(e) {
    e.preventDefault(); // 기본 동작을 방지
}

// 드래그 중인 요소가 다른 요소 위로 들어갈 때 호출되는 함수
function dragEnter(e) {
    e.preventDefault(); // 기본 동작을 방지
}

// 드래그 중인 요소가 다른 요소 위에서 나갈 때 호출되는 함수
function dragLeave() {}

// 드래그 중인 요소를 다른 요소 위에 드롭할 때 호출되는 함수
function dragDrop() {
    otherTile = this; // 드롭된 타일을 가리킴
}

// 드래그가 끝날 때 호출되는 함수
function dragEnd() {
    // 타일을 교환할 수 있는지 확인
    let currCoords = currTile.id.split("-"); // 예: "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    // 인접한 위치인지 확인
    let isAdjacent = false;

    if (Math.abs(r - r2) + Math.abs(c - c2) === 1) {
        isAdjacent = true;
    }

    if (isAdjacent) {
        // 타일 이미지 교환
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        // 턴 수 증가 및 업데이트
        turns += 1;
        document.getElementById("turns").innerText = turns.toString();

        // 퍼즐 완성 상태 확인
        checkPuzzleCompleted();
    }
}

// 퍼즐 완성 상태 확인 함수
function checkPuzzleCompleted() {
    let tiles = document.querySelectorAll('#board img'); // 모든 타일 선택
    let completed = true;
    for (let i = 0; i < tiles.length; i++) {
        let tileNum = tiles[i].src.match(/(\d+)\.jpg$/); // 정규식을 사용하여 파일 이름에서 숫자 추출
        if (tileNum && parseInt(tileNum[1]) !== i + 1) { // 타일 숫자가 위치와 일치하지 않으면
            completed = false;
            break;
        }
    }

    // 퍼즐이 완성되었으면 완성된 이미지와 문구 표시
    if (completed) {
        document.getElementById("board").innerHTML = '<img src="10.jpg" alt="Puzzle Completed" style="width: 100%; height: 100%;">'; // 보드에 완성된 이미지 표시
        document.getElementById("turns").innerHTML = "완성되었습니다!"; // 턴 수 대신 완성 문구 표시
    }
}
